import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { concatMap, from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly chunkSize = 2 * 1024 * 1024; // 2MB

  public uploadFile(file: Blob, fileName: string, sessionId: string): Observable<any> {
    const totalChunks = Math.ceil(file.size / this.chunkSize);

    const chunks = Array.from({ length: totalChunks }, (_, index) => {
      const start = index * this.chunkSize;
      const end = Math.min(start + this.chunkSize, file.size);

      return {
        index,
        blob: file.slice(start, end),
      };
    });

    return from(chunks).pipe(
      concatMap((chunk) =>
        this.uploadChunk(chunk.blob, chunk.index, totalChunks, fileName, sessionId),
      ),
    );
  }

  private uploadChunk(
    chunk: Blob,
    index: number,
    total: number,
    fileName: string,
    sessionId: string,
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', chunk);
    formData.append('index', index.toString());
    formData.append('total', total.toString());
    formData.append('fileName', fileName);
    formData.append('sessionId', sessionId);

    return this.http.post('/api/upload/chunk', formData);
  }

  public finalizeUpload(sessionId: string, fileName: string): Observable<{ path: string }> {
    return this.http.post<{ path: string }>('/api/upload/finalize', {
      sessionId,
      fileName,
    });
  }
}
