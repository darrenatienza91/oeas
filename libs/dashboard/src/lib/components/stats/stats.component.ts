import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExamCard, User } from '@batstateu/data-models';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';

@Component({
  imports: [NgZorroAntdModule, CommonModule],
  selector: 'batstateu-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.less'],
})
export class StatsComponent implements OnInit {
  @Input() upcomingExams!: ExamCard[];
  @Input() user!: User | null;
  constructor(private router: Router) {}

  ngOnInit(): void {}

  openExam(examId?: number) {
    if (this.user?.userType == 'Student') {
      this.router.navigate([`exams/${examId}/take-exam`]);
    } else {
      this.router.navigate([`exams/${examId}/form`]);
    }
  }
}
