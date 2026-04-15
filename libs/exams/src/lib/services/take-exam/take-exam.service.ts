import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from '@batstateu/app-config';
import {
  ExamAnswer,
  ExamAttemptDetail,
  ExamAttemptQuestion,
  ResponseWrapper,
} from '@batstateu/data-models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TakeExamService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly appConfig: AppConfig = inject(APP_CONFIG);

  public movePreviousQuestion(examAttemptId: number): Observable<{ isFirst: boolean }> {
    return this.httpClient.post<{ isFirst: boolean }>(
      `${this.appConfig.apiUrl}/exam-attempts/${examAttemptId}/previous-question`,
      null,
    );
  }
  public moveNextQuestion(examAttemptId: number): Observable<{ isLast: boolean }> {
    return this.httpClient.post<{ isLast: boolean }>(
      `${this.appConfig.apiUrl}/exam-attempts/${examAttemptId}/next-question`,
      null,
    );
  }

  addAnswer(attemptId: number, questionId: number, val: ExamAnswer): Observable<void> {
    return this.httpClient.put<void>(
      `${this.appConfig.apiUrl}/exam-attempts/${attemptId}/questions/${questionId}/answer`,
      val,
    );
  }
  public getCurrentQuestion(examAttemptId: number): Observable<ExamAttemptQuestion> {
    return this.httpClient.get<ExamAttemptQuestion>(
      `${this.appConfig.apiUrl}/exam-attempts/${examAttemptId}/current-question`,
    );
  }

  public getNextQuestion(examAttemptId: number): Observable<ExamAttemptQuestion> {
    return this.httpClient.get<ExamAttemptQuestion>(
      `${this.appConfig.apiUrl}/exam-attempts/${examAttemptId}/current-question`,
    );
  }
  getAnswers(userDetailId: number): Observable<ExamAnswer[]> {
    return this.httpClient
      .get<
        ResponseWrapper<ExamAnswer>
      >(`${this.appConfig.apiUrl}/records/examAnswers?filter=userDetailId,eq,${userDetailId}`)
      .pipe(map((res: ResponseWrapper<any>) => res.records));
  }
  public getExamAttemptByExamId(examId: number): Observable<ExamAttemptDetail> {
    return this.httpClient.get<ExamAttemptDetail>(
      `${this.appConfig.apiUrl}/exams/${examId}/my-attempt`,
    );
  }
  get(examAttemptId: number): Observable<ExamAttemptDetail> {
    return this.httpClient.get<ExamAttemptDetail>(
      `${this.appConfig.apiUrl}/records/exam-attempts/${examAttemptId}`,
    );
  }

  public addExamAttempt(examId: number): Observable<ExamAttemptDetail> {
    return this.httpClient.post<ExamAttemptDetail>(
      `${this.appConfig.apiUrl}/exams/${examId}/my-attempt`,
      {},
    );
  }

  updateExamAttempt(examAttemptId: number, val: ExamAttemptDetail): Observable<number> {
    return this.httpClient.put<number>(
      `${this.appConfig.apiUrl}/records/exams-attempts/${examAttemptId}`,
      val,
    );
  }

  public finishExam(examAttemptId: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.appConfig.apiUrl}/exam-attempts/${examAttemptId}`, {
      isAttemptSubmitted: true,
    });
  }
}
