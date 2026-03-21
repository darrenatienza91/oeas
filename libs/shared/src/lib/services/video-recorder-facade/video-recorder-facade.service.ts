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

  // Derived state
  readonly isRecording = computed(() => this.state() === 'recording');
  readonly isReady = computed(() => this.state() === 'ready');

  init(player: VideoJsPlayerWithRecord) {
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
    });

    start$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.state.set('recording'));

    stop$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.state.set('stopped'));

    finish$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((blob) => {
      this.recordedBlob.set(blob);
      this.state.set('finished');
    });

    deviceError$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((err) => {
      this.error.set(err);
      this.state.set('error');
    });

    error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((err) => {
      this.error.set(err);
      this.state.set('error');
    });
  }

  // 🎮 Controls
  start() {
    this.player.record().start();
  }

  stop() {
    this.player.record().stop();
  }

  reset() {
    this.recordedBlob.set(null);
    this.error.set(null);
    this.state.set('idle');
  }

  // Optional centralized handler
  private handleEvent(_: unknown) {
    // useful for logging / analytics
  }
}

type RecordingState = 'idle' | 'ready' | 'recording' | 'stopped' | 'finished' | 'error';
