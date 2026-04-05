import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, concatMap, EMPTY, filter, from, map, Observable, retry, toArray } from 'rxjs';
import { UploadConfig } from './upload-config';
import { APP_CONFIG } from '@batstateu/app-config';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(APP_CONFIG);
  private readonly chunkSize = 2 * 1024 * 1024;

  public uploadFile(
    file: Blob,
    fileName: string,
    config: UploadConfig,
    sessionId?: string,
  ): Observable<{ totalChunks: number }> {
    const totalChunks = Math.ceil(file.size / this.chunkSize);

    const chunks = Array.from({ length: totalChunks }, (_, index) => {
      const start = index * this.chunkSize;
      const end = Math.min(start + this.chunkSize, file.size);

      return {
        index,
        blob: file.slice(start, end),
      };
    });

    if (chunks.length === 0) {
      return EMPTY;
    }

    const upload$ = from(chunks).pipe(
      filter(() => chunks.length > 0),
      concatMap((chunk) => {
        console.log('Uploading Chunk', chunk);
        return this.uploadChunk(
          chunk.blob,
          chunk.index,
          totalChunks,
          fileName,
          sessionId!,
          config,
        ).pipe(
          retry(3),
          catchError((error) => {
            console.error('Chunk Failed to upload ', error);
            return EMPTY;
          }),
        );
      }),
      toArray(),
      map(() => ({
        totalChunks: totalChunks,
      })),
    );

    return upload$;
  }

  private uploadChunk(
    chunk: Blob,
    index: number,
    total: number,
    fileName: string,
    sessionId: string,
    config: UploadConfig,
  ): Observable<void> {
    const formData = new FormData();
    formData.append('file', chunk);
    formData.append('index', index.toString());
    formData.append('total', total.toString());
    formData.append('fileName', fileName);
    formData.append('sessionId', sessionId);

    return this.http.post<void>(`${this.appConfig.apiUrl}${config.chunkUrl}`, formData);
  }

  public finalizeUpload(
    sessionId: string,
    fileName: string,
    config: UploadConfig,
    totalChunks: number,
  ): Observable<{ path: string }> {
    console.log('Finalizing upload');
    return this.http.post<{ path: string }>(`${this.appConfig.apiUrl}${config.finalizeUrl}`, {
      sessionId,
      fileName,
      totalChunks,
    });
  }

  public initializeUpload(config: UploadConfig): Observable<{ sessionId: string }> {
    if (!config.initUrl) {
      throw new Error('initUrl is required for session-based upload');
    }

    return this.http.post<{ sessionId: string }>(`${this.appConfig.apiUrl}${config.initUrl}`, {});
  }
}
