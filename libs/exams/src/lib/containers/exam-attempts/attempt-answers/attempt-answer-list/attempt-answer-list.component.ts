import { CommonModule } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { ExamAttemptAnswerList } from '../../services/exam-attempt/exam-attempt-answer-list';

@Component({
  imports: [ReactiveFormsModule, FormsModule, NgZorroAntdModule, RouterLink, CommonModule],
  selector: 'batstateu-attempt-answer-list',
  templateUrl: './attempt-answer-list.component.html',
  styleUrls: ['./attempt-answer-list.component.less'],
})
export class AttemptAnswerListComponent {
  public examAttemptResultList = input<ExamAttemptAnswerList[]>([]);
  public searchText = model<string>('');
}
