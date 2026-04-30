import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Exam, ExamAnswer, ExamCard, ResponseWrapper } from '@batstateu/data-models';
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
}
