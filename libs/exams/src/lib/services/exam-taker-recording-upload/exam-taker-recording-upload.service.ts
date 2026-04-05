import { inject, Injectable } from '@angular/core';
import { UploadService } from '@batstateu/shared';
import { filter, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamTakerRecordingUploadService {
  private readonly upload = inject(UploadService);

  public uploadRecording(file: File, attemptId: number): Observable<{ path: string }> {
    const config = {
      initUrl: `/exam-attempts/${attemptId}/recording/init`,
      chunkUrl: `/exam-attempts/${attemptId}/recording/chunk`,
      finalizeUrl: `/exam-attempts/${attemptId}/recording/finalize`,
    };

    return this.upload.initializeUpload(config).pipe(
      switchMap(({ sessionId }) =>
        this.upload
          .uploadFile(file, file.name, config, sessionId)
          .pipe(map((uploadResult) => ({ sessionId, uploadResult }))),
      ),
      filter(({ uploadResult }) => uploadResult.totalChunks > 0),
      switchMap(({ sessionId, uploadResult }) =>
        this.upload.finalizeUpload(sessionId, file.name, config, uploadResult.totalChunks),
      ),
    );
  }
}
