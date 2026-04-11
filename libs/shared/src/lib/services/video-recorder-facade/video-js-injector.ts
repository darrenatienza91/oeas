import { InjectionToken } from '@angular/core';
import { VideoRecorderFacadeService } from './video-recorder-facade.service';

export const CAMERA_RECORDER = new InjectionToken<VideoRecorderFacadeService>('CAMERA_RECORDER');
export const SCREEN_RECORDER = new InjectionToken<VideoRecorderFacadeService>('SCREEN_RECORDER');
