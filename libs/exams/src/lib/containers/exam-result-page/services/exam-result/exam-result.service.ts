import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ExamCheckingStatus, isTakeExamCheckingStatus } from '../../exam-checking-status';
import { ExamResultStatus, isTakeExamResultStatus } from '../../exam-result-status';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '@batstateu/app-config';

@Injectable({
  providedIn: 'root',
})
export class ExamResultService {
  private readonly httpClient = inject(HttpClient);
  private readonly appConfig = inject(APP_CONFIG);

  public getExamResult(examId: number): Observable<{
    checkingStatus: ExamCheckingStatus;
    result: ExamResultStatus;
    percentage: number;
  }> {
    return this.httpClient
      .get<{
        checkingStatus: ExamCheckingStatus;
        result: ExamResultStatus;
        percentage: number;
      }>(`${this.appConfig.apiUrl}/exams/${examId}/my-result`)
      .pipe(
        map((examResult) => ({
          ...examResult,
          checkingStatus: isTakeExamCheckingStatus(examResult.checkingStatus)
            ? examResult.checkingStatus
            : 'Unknown',
          result: isTakeExamResultStatus(examResult.result) ? examResult.result : 'Unknown',
        })),
      );
  }
}
