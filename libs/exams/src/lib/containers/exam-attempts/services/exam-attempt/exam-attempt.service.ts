import { Injectable } from '@angular/core';
import { BaseApiService, buildHttpParams, QueryParams } from '@batstateu/shared';
import { ExamAttemptList } from '../../exam-attempt-list.model';
import { Observable } from 'rxjs';
import { ExamAttemptCriteria } from './exam-attempt-criteria';
import { ExamAttemptAnswerCriteria } from './exam-attempt-answer-criteria';
import { ExamAttemptAnswerList } from './exam-attempt-answer-list';

@Injectable({
  providedIn: 'root',
})
export class ExamAttemptService extends BaseApiService {
  public getAllExamAttempts(
    examId: number,
    criteria: QueryParams<ExamAttemptCriteria>,
  ): Observable<ExamAttemptList[]> {
    const params = buildHttpParams(criteria);

    return this.get<ExamAttemptList[]>(`${this.appConfig.apiUrl}/exams/${examId}/attempts`, params);
  }

  getAllAttemptAnswersByCriteria(
    attemptId: number,
    criteria: QueryParams<ExamAttemptAnswerCriteria>,
  ): Observable<ExamAttemptAnswerList[]> {
    const params = buildHttpParams(criteria);

    return this.get<ExamAttemptAnswerList[]>(
      `${this.appConfig.apiUrl}/exam-attempts/${attemptId}/answers`,
      params,
    );
  }
}
