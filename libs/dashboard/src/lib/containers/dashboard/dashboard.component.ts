import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExamsService } from '@batstateu/shared';
import { Store } from '@ngrx/store';
import * as fromAuth from '@batstateu/auth';
import { StatsComponent } from '../../components/stats/stats.component';
import { Router } from '@angular/router';
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
  private examService = inject(ExamsService);
  private store = inject(Store<fromAuth.State>);
  private router = inject(Router);

  public auth = toSignal(this.store.select(fromAuth.getAuthSuccess), { initialValue: null });

  public upcomingExams = toSignal(
    this.examService.getAllStartOn(new Date().toISOString(), this.auth()?.user.sectionId ?? null),
    { initialValue: [] },
  );

  ngOnInit(): void {}
  public openExam(examId?: number) {
    if (this.auth()?.user.userType == 'Student') {
      this.router.navigate([`exams/${examId}/take-exam`]);
    } else {
      this.router.navigate([`exams/${examId}/form`]);
    }
  }
}
