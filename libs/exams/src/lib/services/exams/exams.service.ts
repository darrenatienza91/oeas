import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  AnswerFormModel,
  Exam,
  ExamAnswer,
  ExamCard,
  ExamRecordViewModel,
  ExamAttemptResultList,
  ResponseWrapper,
} from '@batstateu/data-models';
import { map, Observable } from 'rxjs';
import { APP_CONFIG, AppConfig } from '@batstateu/app-config';

@Injectable({
  providedIn: 'root',
})
export class ExamsService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly appConfig: AppConfig = inject(APP_CONFIG);

  public activate(id?: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.appConfig.apiUrl}/exams/${id}/activate`, null);
  }

  public deActivate(id?: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.appConfig.apiUrl}/exams/${id}/de-activate`, null);
  }
  public getAllStartOn(date: string, sectionId: number | null): Observable<ExamCard[]> {
    return this.httpClient.get<ExamCard[]>(`${this.appConfig.apiUrl}/exams?startOn=${date}`);
  }
  getExamAttemptByExamIdAttemptId(
    examId: number,
    attemptId: number,
  ): Observable<ExamRecordViewModel> {
    return this.httpClient
      .get<
        ResponseWrapper<ExamRecordViewModel>
      >(`${this.appConfig.apiUrl}/records/attemptExams?filter=userDetailId,eq,${attemptId}&filter=examId,eq,${examId}`)
      .pipe(
        map((res: ResponseWrapper<any>) => {
          return res.records[0];
        }),
      );
  }

  editAnswerPoints(id: number, points: number): Observable<number> {
    return this.httpClient
      .put<number>(`${this.appConfig.apiUrl}/records/examAnswers/${id}`, {
        points: points,
      })
      .pipe(map((res: number) => res));
  }

  getExamAnswer(id: number) {
    return this.httpClient
      .get<AnswerFormModel>(`${this.appConfig.apiUrl}/records/examAnswers/${id}?join=questions`)
      .pipe(
        map((res: any) => {
          const rec: AnswerFormModel = {
            question: res.questionId.question,
            correctAnswer: res.questionId.correctAnswer,
            answer: res.answer,
            maxPoints: res.questionId.maxpoints,
          };
          return rec;
        }),
      );
  }

  public edit(val: Exam): Observable<number> {
    return this.httpClient.patch<number>(`${this.appConfig.apiUrl}/exams/${val.id}`, val);
  }

  public get(id: number): Observable<Exam> {
    return this.httpClient.get<Exam>(`${this.appConfig.apiUrl}/exams/${id}`);
  }

  delete(id: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.appConfig.apiUrl}/exams/${id}`);
  }

  public add(val: Exam): Observable<Exam> {
    return this.httpClient.post<Exam>(`${this.appConfig.apiUrl}/exams`, val);
  }

  public getAll(criteria: string): Observable<Exam[]> {
    return this.httpClient.get<Exam[]>(`${this.appConfig.apiUrl}/exams?criteria=${criteria}`);
  }

  public getAllAttemptAnswers(userDetailId: number, examId: number): Observable<ExamAnswer[]> {
    return this.httpClient
      .get<
        ResponseWrapper<ExamAnswer>
      >(`${this.appConfig.apiUrl}/records/examAnswers?filter=userDetailId,eq,${userDetailId}&filter=examId,eq,${examId}`)
      .pipe(
        map((res: ResponseWrapper<any>) => {
          return res.records;
        }),
      );
  }

  getAllAttemptAnswersByCriteria(
    userDetailId: number,
    examId: number,
    criteria: string,
  ): Observable<ExamAttemptResultList[]> {
    return this.httpClient
      .get<
        ResponseWrapper<ExamAttemptResultList>
      >(`${this.appConfig.apiUrl}/records/examAnswers?join=questions&filter=userDetailId,eq,${userDetailId}&filter=examId,eq,${examId}`)
      .pipe(
        map((res: ResponseWrapper<any>) => {
          const rec: ExamAttemptResultList[] = [];
          res.records.map((val) => {
            if (val.questionId?.question.toLowerCase().includes(criteria.toLowerCase())) {
              rec.push({
                id: val.id,
                name: val.questionId?.question,
                points: val.points,
              });
            }
          });
          return rec;
        }),
      );
  }
}
