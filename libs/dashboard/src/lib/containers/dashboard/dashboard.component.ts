import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExamsService } from '@batstateu/shared';
import { Store } from '@ngrx/store';
import * as fromAuth from '@batstateu/auth';
import { StatsComponent } from '../../components/stats/stats.component';
import { Router } from '@angular/router';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
export interface Person {
  key: string;
  date: string;
  details: string;
}
@Component({
  imports: [StatsComponent, NgZorroAntdModule],
  selector: 'batstateu-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  private readonly examService = inject(ExamsService);
  private readonly store = inject(Store<fromAuth.State>);
  private readonly router = inject(Router);

  public auth = toSignal(this.store.select(fromAuth.getAuthSuccess), { initialValue: null });

  public upcomingExams = toSignal(
    this.examService.getAllStartOn(new Date().toISOString(), this.auth()?.user.sectionId ?? null),
    { initialValue: [] },
  );

  public openExam(examId?: number) {
    if (this.auth()?.user.role == 'Student') {
      this.router.navigate([`exams/${examId}/take-exam`]);
    } else {
      this.router.navigate([`exams/${examId}/form`]);
    }
  }
}
