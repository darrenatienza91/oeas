import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '@batstateu/app-config';
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
  public movePreviousQuestion(takerExamId: number): Observable<{ isFirst: boolean }> {
    return this.httpClient.post<{ isFirst: boolean }>(
      `${this.appConfig.API_URL}/exam-attempts/${takerExamId}/previous-question`,
      null,
    );
  }
  public moveNextQuestion(takerExamId: number): Observable<{ isLast: boolean }> {
    return this.httpClient.post<{ isLast: boolean }>(
      `${this.appConfig.API_URL}/exam-attempts/${takerExamId}/next-question`,
      null,
    );
  }

  addAnswer(attemptId: number, questionId: number, val: ExamAnswer): Observable<void> {
    return this.httpClient.put<void>(
      `${this.appConfig.API_URL}/exam-attempts/${attemptId}/questions/${questionId}/answer`,
      val,
    );
  }
  public getCurrentQuestion(examAttemptId: number): Observable<TakerExamQuestion> {
    return this.httpClient.get<TakerExamQuestion>(
      `${this.appConfig.API_URL}/exam-attempts/${examAttemptId}/current-question`,
    );
  }

  public getNextQuestion(examAttemptId: number): Observable<TakerExamQuestion> {
    return this.httpClient.get<TakerExamQuestion>(
      `${this.appConfig.API_URL}/exam-attempts/${examAttemptId}/current-question`,
    );
  }
  getAnswers(userDetailId: number): Observable<ExamAnswer[]> {
    return this.httpClient
      .get<
        ResponseWrapper<ExamAnswer>
      >(`${this.appConfig.API_URL}/records/examAnswers?filter=userDetailId,eq,${userDetailId}`)
      .pipe(map((res: ResponseWrapper<any>) => res.records));
  }
  getExamTakerByExamId(examId: number): Observable<ExamTakerDetail> {
    return this.httpClient.get<ExamTakerDetail>(
      `${this.appConfig.API_URL}/exams/${examId}/my-attempt`,
    );
  }
  get(takerExamId: number): Observable<ExamTakerDetail> {
    return this.httpClient.get<ExamTakerDetail>(
      `${this.appConfig.API_URL}/records/takerExams/${takerExamId}`,
    );
  }

  public addExamTaker(examId: number): Observable<ExamTakerDetail> {
    return this.httpClient.post<ExamTakerDetail>(
      `${this.appConfig.API_URL}/exams/${examId}/my-attempt`,
      {},
    );
  }
  updateTakerExam(takerExamId: number, val: ExamTakerDetail): Observable<number> {
    return this.httpClient.put<number>(
      `${this.appConfig.API_URL}/records/takerExams/${takerExamId}`,
      val,
    );
  }
  upload(data: any): Observable<any> {
    const serverUrl = `${this.appConfig.API_URL}/file-upload`;
    const formData = new FormData();
    formData.append('file', data, data.name);

    console.log('uploading recording:', data.name);

    return this.httpClient.post<any>(serverUrl, formData);
  }
  constructor(
    private httpClient: HttpClient,
    @Inject(APP_CONFIG) private appConfig: any,
  ) {}
}
