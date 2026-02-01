import { Component, OnInit } from '@angular/core';
import { ExamCard, User } from '@batstateu/data-models';
import { ExamsService } from '@batstateu/shared';
import { Store } from '@ngrx/store';
import * as fromAuth from '@batstateu/auth';
import { StatsComponent } from '../../components/stats/stats.component';
import { forkJoin, of, switchMap, take } from 'rxjs';
export interface Person {
  key: string;
  date: string;
  details: string;
}
@Component({
  imports: [StatsComponent],
  selector: 'batstateu-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public upcomingExams!: ExamCard[];
  public user: User = {} as User;

  constructor(
    private examService: ExamsService,
    private store: Store<fromAuth.State>,
  ) {}

  ngOnInit(): void {
    const isoUtcNoMs = new Date().toISOString();
    this.store
      .select(fromAuth.getAuthSuccess)
      .pipe(
        switchMap((authSuccess) =>
          forkJoin([
            of(authSuccess),
            this.examService.getAllStartOn(isoUtcNoMs, authSuccess?.user.sectionId ?? null),
          ]),
        ),
        take(1),
      )
      .subscribe(([authSuccess, exams]) => {
        this.user = authSuccess?.user as User;
        this.upcomingExams = exams;
      });
  }
}
