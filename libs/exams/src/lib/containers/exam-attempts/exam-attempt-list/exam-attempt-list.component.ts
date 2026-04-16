import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { ExamAttemptList } from '../exam-attempt-list.model';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

@Component({
  imports: [FormsModule, NgZorroAntdModule, RouterLink, CommonModule, NzTooltipDirective],
  selector: 'batstateu-exam-attempt-list',
  templateUrl: './exam-attempt-list.component.html',
  styleUrls: ['./exam-attempt-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamAttemptListComponent {
  public examAttemptList = input<ExamAttemptList[]>([]);

  public searchText = model<string>();
}
