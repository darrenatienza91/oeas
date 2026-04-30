import { Injectable } from '@angular/core';
import { BaseApiService, buildHttpParams, QueryParams } from '@batstateu/shared';
import { ExamAttemptList } from '../../exam-attempt-list.model';
import { Observable } from 'rxjs';
import { ExamAttemptCriteria } from './exam-attempt-criteria';
import { ExamAttemptAnswerCriteria } from './exam-attempt-answer-criteria';
import { ExamAttemptAnswerList } from './exam-attempt-answer-list';
import { AttemptAnswerDto } from '../../attempt-answer.dto';
import { ExamAttemptRecordingPreviewDto } from './exam-attempt-recording-preview.dto';

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

  public getExamAttemptDetail(id: number): Observable<ExamAttemptRecordingPreviewDto> {
    return this.get<ExamAttemptRecordingPreviewDto>(
      `${this.appConfig.apiUrl}/exam-attempts/${id}/recording-preview`,
    );
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

  public getAttemptAnswer(id: number, attemptId: number): Observable<AttemptAnswerDto> {
    return this.get<AttemptAnswerDto>(
      `${this.appConfig.apiUrl}/exam-attempts/${attemptId}/answers/${id}`,
    );
  }

  public editAnswerPoints(id: number, attemptId: number, points: number): Observable<void> {
    return this.http.patch<void>(
      `${this.appConfig.apiUrl}/exam-attempts/${attemptId}/answers/${id}`,
      {
        acquiredPoints: points,
      },
    );
  }
}
