import { Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, interval, startWith, switchMap, takeWhile, tap } from 'rxjs';

@Injectable()
export class CountdownTimerService {
  private duration = signal(10);
  private isRunning = signal(false);

  // Main countdown signal
  public time = toSignal(
    toObservable(this.isRunning).pipe(
      switchMap((running) => {
        if (!running) return EMPTY;

        return interval(1000).pipe(
          startWith(0),
          tap(() => this.duration.update((v) => v - 1)),
          takeWhile((v) => v >= 0),
        );
      }),
    ),
    { initialValue: 10 },
  );

  public start(seconds: number) {
    this.duration.set(seconds);
    this.isRunning.set(true);
  }

  public pause(): void {
    this.isRunning.set(false);
  }

  public resume(): void {
    if (this.duration() > 0) {
      this.isRunning.set(true);
    }
  }

  public reset(initialValue: number = 10): void {
    this.isRunning.set(false);
    this.duration.set(initialValue);
  }
}
