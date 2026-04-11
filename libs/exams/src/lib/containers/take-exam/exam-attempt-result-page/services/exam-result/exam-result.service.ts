import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { isTakeExamCheckingStatus } from '../../models/exam-checking-status';
import { isTakeExamResultStatus } from '../../models/exam-result-status';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '@batstateu/app-config';
import { ExamAttemptResultDto } from '../../models/exam-attempt-dto';

@Injectable({
  providedIn: 'root',
})
export class ExamResultService {
  private readonly httpClient = inject(HttpClient);
  private readonly appConfig = inject(APP_CONFIG);

  public getExamResult(examId: number): Observable<ExamAttemptResultDto> {
    return this.httpClient
      .get<ExamAttemptResultDto>(`${this.appConfig.apiUrl}/exams/${examId}/my-result`)
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
