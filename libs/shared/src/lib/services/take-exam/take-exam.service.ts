import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from '@batstateu/app-config';
import {
  ExamAnswer,
  ResponseWrapper,
  TakerExamDetail as ExamTakerDetail,
  TakerExamQuestion,
} from '@batstateu/data-models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TakeExamService {
  private httpClient: HttpClient = inject(HttpClient);
  private appConfig: AppConfig = inject(APP_CONFIG);

  public movePreviousQuestion(takerExamId: number): Observable<{ isFirst: boolean }> {
    return this.httpClient.post<{ isFirst: boolean }>(
      `${this.appConfig.apiUrl}/exam-attempts/${takerExamId}/previous-question`,
      null,
    );
  }
  public moveNextQuestion(takerExamId: number): Observable<{ isLast: boolean }> {
    return this.httpClient.post<{ isLast: boolean }>(
      `${this.appConfig.apiUrl}/exam-attempts/${takerExamId}/next-question`,
      null,
    );
  }

  addAnswer(attemptId: number, questionId: number, val: ExamAnswer): Observable<void> {
    return this.httpClient.put<void>(
      `${this.appConfig.apiUrl}/exam-attempts/${attemptId}/questions/${questionId}/answer`,
      val,
    );
  }
  public getCurrentQuestion(examAttemptId: number): Observable<TakerExamQuestion> {
    return this.httpClient.get<TakerExamQuestion>(
      `${this.appConfig.apiUrl}/exam-attempts/${examAttemptId}/current-question`,
    );
  }

  public getNextQuestion(examAttemptId: number): Observable<TakerExamQuestion> {
    return this.httpClient.get<TakerExamQuestion>(
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
  getExamTakerByExamId(examId: number): Observable<ExamTakerDetail> {
    return this.httpClient.get<ExamTakerDetail>(
      `${this.appConfig.apiUrl}/exams/${examId}/my-attempt`,
    );
  }
  get(takerExamId: number): Observable<ExamTakerDetail> {
    return this.httpClient.get<ExamTakerDetail>(
      `${this.appConfig.apiUrl}/records/takerExams/${takerExamId}`,
    );
  }

  public addExamTaker(examId: number): Observable<ExamTakerDetail> {
    return this.httpClient.post<ExamTakerDetail>(
      `${this.appConfig.apiUrl}/exams/${examId}/my-attempt`,
      {},
    );
  }

  updateTakerExam(takerExamId: number, val: ExamTakerDetail): Observable<number> {
    return this.httpClient.put<number>(
      `${this.appConfig.apiUrl}/records/takerExams/${takerExamId}`,
      val,
    );
  }
}
