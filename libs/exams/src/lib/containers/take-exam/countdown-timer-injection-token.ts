import { InjectionToken } from '@angular/core';
import { CountdownTimerService } from '../../countdown-timer/countdown-timer.service';

export const RECORDING_COUNTDOWN_TO_PAUSE = new InjectionToken<CountdownTimerService>(
  'RECORDING_COUNTDOWN_TO_PAUSE',
);
export const INACTIVE_COUNTDOWN = new InjectionToken<CountdownTimerService>('INACTIVE_COUNTDOWN');
export const EXAMINATION_DURATION_COUNTDOWN = new InjectionToken<CountdownTimerService>(
  'EXAMINATION_DURATION_COUNTDOWN',
);
