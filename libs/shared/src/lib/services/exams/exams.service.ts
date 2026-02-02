import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '@batstateu/app-config';
import {
  AnswerFormModel,
  Exam,
  ExamAnswer,
  ExamCard,
  ExamRecordViewModel,
  ExamTakerList,
  ExamTakerResultList,
  ResponseWrapper,
} from '@batstateu/data-models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamsService {
  changeStatus(id?: number, status?: boolean): Observable<number> {
    return this.httpClient
      .put<number>(`${this.appConfig.API_URL}/records/exams/${id}`, {
        isActive: status,
      })
      .pipe(map((res: number) => res));
  }
  public getAllStartOn(date: string, sectionId: number | null): Observable<ExamCard[]> {
    return this.httpClient.get<ExamCard[]>(
      `${this.appConfig.API_URL}/exams?sectionId=${sectionId ?? 0}&startOn=${date}`,
    );
  }
  getExamTakerByExamIdTakerId(examId: number, takerId: number): Observable<ExamRecordViewModel> {
    return this.httpClient
      .get<
        ResponseWrapper<ExamRecordViewModel>
      >(`${this.appConfig.API_URL}/records/takerExams?filter=userDetailId,eq,${takerId}&filter=examId,eq,${examId}`)
      .pipe(
        map((res: ResponseWrapper<any>) => {
          return res.records[0];
        }),
      );
  }
  editAnswerPoints(id: number, points: number): Observable<number> {
    return this.httpClient
      .put<number>(`${this.appConfig.API_URL}/records/examAnswers/${id}`, {
        points: points,
      })
      .pipe(map((res: number) => res));
  }
  getExamAnswer(id: number) {
    return this.httpClient
      .get<AnswerFormModel>(`${this.appConfig.API_URL}/records/examAnswers/${id}?join=questions`)
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
  edit(val: Exam): Observable<number> {
    return this.httpClient
      .put<number>(`${this.appConfig.API_URL}/records/exams/${val.id}`, val)
      .pipe(map((res: number) => res));
  }
  get(id: number): Observable<Exam> {
    return this.httpClient.get<Exam>(`${this.appConfig.API_URL}/exams/${id}`);
  }
  delete(id: number): Observable<number> {
    return this.httpClient.delete<number>(`${this.appConfig.API_URL}/records/exams/${id}`);
  }
  public add(val: Exam): Observable<Exam> {
    return this.httpClient.post<Exam>(`${this.appConfig.API_URL}/exams`, val);
  }

  public getAll(
    criteria: string,
    sectionId: number | null,
    userDetailId: number | null,
  ): Observable<Exam[]> {
    return this.httpClient.get<Exam[]>(
      `${this.appConfig.API_URL}/user-details/${userDetailId}/sections/${sectionId}/exams?criteria=${criteria}`,
    );
  }

  getAllTakerAnswers(userDetailId: number, examId: number): Observable<ExamAnswer[]> {
    return this.httpClient
      .get<
        ResponseWrapper<ExamAnswer>
      >(`${this.appConfig.API_URL}/records/examAnswers?filter=userDetailId,eq,${userDetailId}&filter=examId,eq,${examId}`)
      .pipe(
        map((res: ResponseWrapper<any>) => {
          return res.records;
        }),
      );
  }

  getAllTakerAnswersByCriteria(
    userDetailId: number,
    examId: number,
    criteria: string,
  ): Observable<ExamTakerResultList[]> {
    return this.httpClient
      .get<
        ResponseWrapper<ExamTakerResultList>
      >(`${this.appConfig.API_URL}/records/examAnswers?join=questions&filter=userDetailId,eq,${userDetailId}&filter=examId,eq,${examId}`)
      .pipe(
        map((res: ResponseWrapper<any>) => {
          const rec: ExamTakerResultList[] = [];
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

  getAllExamTakers(examId: number, criteria: string): Observable<ExamTakerList[]> {
    return this.httpClient
      .get<
        ResponseWrapper<ExamTakerList>
      >(`${this.appConfig.API_URL}/records/takerExams?join=userDetails,departments&join=userDetails,sections&filter=examId,eq,${examId}`)
      .pipe(
        map((res: ResponseWrapper<any>) => {
          const rec: ExamTakerList[] = [];
          res.records.map((val) => {
            if (
              val.userDetailId.firstName.toLowerCase().includes(criteria.toLowerCase()) ||
              val.userDetailId.middleName.toLowerCase().includes(criteria.toLowerCase()) ||
              val.userDetailId.lastName.toLowerCase().includes(criteria.toLowerCase())
            ) {
              rec.push({
                id: val.id,
                name: `${val.userDetailId?.firstName} ${val.userDetailId?.middleName} ${val.userDetailId?.lastName}`,
                section: val.userDetailId?.sectionId?.name,
                department: val.userDetailId?.departmentId?.name,
                score: '',
                hasRecording: val.recUrl !== '',
                recUrl: val.recUrl,
                userDetailId: val.userDetailId?.id,
                examId: val.examId,
              });
            }
          });
          return rec;
        }),
      );
  }

  constructor(
    private httpClient: HttpClient,
    @Inject(APP_CONFIG) private appConfig: any,
  ) {}
}
