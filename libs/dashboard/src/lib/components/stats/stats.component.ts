import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ExamCard } from '@batstateu/data-models';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

@Component({
  imports: [NgZorroAntdModule, CommonModule, NzTooltipDirective],
  selector: 'batstateu-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.less'],
})
export class StatsComponent {
  public upcomingExams = input<ExamCard[]>([]);
  public openExam = output<number>();
}
