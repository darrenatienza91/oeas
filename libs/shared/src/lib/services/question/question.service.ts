import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '@batstateu/app-config';
import { QuestionDetail, QuestionList, ResponseWrapper } from '@batstateu/data-models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  getAllByExamId(examId: number): Observable<QuestionList[]> {
    return this.httpClient
      .get<
        ResponseWrapper<QuestionList>
      >(`${this.appConfig.API_URL}/records/questions?filter=examId,eq,${examId}`)
      .pipe(map((res: ResponseWrapper<any>) => res.records));
  }
  public delete(id: number, examId: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.appConfig.API_URL}/exams/${examId}/questions/${id}`,
    );
  }
  public getAll(examId: number, criteria: string): Observable<QuestionList[]> {
    return this.httpClient.get<QuestionList[]>(
      `${this.appConfig.API_URL}/exams/${examId}/questions?criteria=${criteria}`,
    );
  }
  public add(val: QuestionDetail): Observable<QuestionDetail> {
    return this.httpClient.post<QuestionDetail>(
      `${this.appConfig.API_URL}/exams/${val.examId}/questions`,
      val,
    );
  }
  public get(id: number, examId: number): Observable<QuestionDetail> {
    return this.httpClient.get<QuestionDetail>(
      `${this.appConfig.API_URL}/exams/${examId}/questions/${id}`,
    );
  }
  public edit(val: QuestionDetail): Observable<number> {
    return this.httpClient.put<number>(
      `${this.appConfig.API_URL}/exams/${val.examId}/questions/${val.id}`,
      val,
    );
  }
  constructor(
    private httpClient: HttpClient,
    @Inject(APP_CONFIG) private appConfig: any,
  ) {}
}
