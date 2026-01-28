import { Component, OnInit } from '@angular/core';
import { ExamCard, User } from '@batstateu/data-models';
import { ExamsService } from '@batstateu/shared';
import { Store } from '@ngrx/store';
import { format } from 'date-fns';
import * as fromAuth from '@batstateu/auth';
import { StatsComponent } from '../../components/stats/stats.component';
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
  upcomingExams!: ExamCard[];
  sectionId!: number | null;
  userDetailId!: number | null;
  user!: User | null;
  getUser() {
    this.store.select(fromAuth.getUser).subscribe((val) => {
      this.sectionId = val?.sectionId;
      this.userDetailId = val?.userDetailId || null;
      this.user = val || null;
    });
  }
  constructor(
    private examService: ExamsService,
    private store: Store<fromAuth.State>
  ) { }

  ngOnInit(): void {
    this.getUser();
    const date = format(new Date(), 'yyyy-MM-dd');
    this.examService
      .getAllStartOn(date, this.sectionId, this.userDetailId)
      .subscribe((val) => (this.upcomingExams = val));
  }
}
