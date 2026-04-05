import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromVideoJsEvent } from './from-video-js-event';
import { Record } from '@batstateu/videojs-record';
import { VideoJsPlayerWithRecord } from './videojs-with-record';
@Injectable()
export class VideoRecorderFacadeService {
  private readonly destroyRef = inject(DestroyRef);
  private player!: VideoJsPlayerWithRecord;
  private readonly plugin = Record;

  // 🔥 Signals
  readonly state = signal<RecordingState>('idle');
  readonly recordedBlob = signal<Blob | null>(null);
  readonly error = signal<string | null>(null);
  readonly isStarted = signal<boolean>(false);

  // Derived state
  readonly isRecording = computed(() => this.state() === 'recording');
  readonly isReady = computed(() => this.state() === 'ready');
  readonly isFinished = computed(() => this.state() === 'finished');

  init(player: VideoJsPlayerWithRecord, isGetDevice: boolean = false) {
    this.player = player;
    console.log(this.plugin.Record.VERSION);

    const deviceReady$ = fromVideoJsEvent(player, 'deviceReady');
    const start$ = fromVideoJsEvent(player, 'startRecord');
    const stop$ = fromVideoJsEvent(player, 'stopRecord');
    const finish$ = fromVideoJsEvent(player, 'finishRecord');
    const deviceError$ = fromVideoJsEvent(player, 'deviceError');
    const error$ = fromVideoJsEvent(player, 'error');

    // Merge all events into a single stream
    merge(deviceReady$, start$, stop$, finish$, deviceError$, error$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        this.handleEvent(event);
      });

    // Individual handlers (cleaner for payloads)
    deviceReady$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.state.set('ready');
      this.player.on('pauseRecord', () => {
        console.log('Recording paused');
      });
    });

    start$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.isStarted.set(true);
      this.state.set('recording');
    });
    stop$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.state.set('stopped');
    });

    finish$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((blob) => {
      this.recordedBlob.set(blob);
      this.state.set('finished');

      this.closeScreenSharingBottomBar();
    });

    deviceError$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((err) => {
      this.error.set(err);
      this.state.set('error');
    });

    error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((err) => {
      this.error.set(err);
      this.state.set('error');
    });

    if (isGetDevice) {
      this.player.record().getDevice();
    }
  }

  // 🎮 Controls
  public start(): void {
    this.player.record().start();
  }

  public stop(): void {
    this.player.record().stop();
  }

  public resume() {
    this.player.record().resume();
    this.state.set('recording');
  }

  public reset(): void {
    this.recordedBlob.set(null);
    this.error.set(null);
    this.state.set('idle');
  }

  public pause(): void {
    this.player.record().pause();
    this.state.set('pause');
  }

  // Optional centralized handler
  private handleEvent(_: unknown) {
    // useful for logging / analytics
  }

  private closeScreenSharingBottomBar(): void {
    const stream = this.player.record().stream;
    stream?.getTracks().forEach((track) => track.stop());
  }
}

type RecordingState = 'idle' | 'ready' | 'recording' | 'stopped' | 'finished' | 'error' | 'pause';
