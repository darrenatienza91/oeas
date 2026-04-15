import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ExamAttemptList } from '@batstateu/data-models';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';

@Component({
  imports: [FormsModule, NgZorroAntdModule, RouterLink, CommonModule],
  selector: 'batstateu-exam-attempt-list',
  templateUrl: './exam-attempt-list.component.html',
  styleUrls: ['./exam-attempt-list.component.less'],
})
export class ExamAttemptListComponent implements OnInit {
  @Input() examAttemptList: ExamAttemptList[] = [];
  @Output() viewScore = new EventEmitter();
  @Output() search = new EventEmitter<string>();
  searchText = '';

  onViewScore(userDetailId: number, examId: number) {
    const takerExamIdObj = { userDetailId: userDetailId, examId: examId };
    this.viewScore.emit(takerExamIdObj);
  }
  onSearchChange(criteria: string) {
    this.search.emit(criteria);
  }
  constructor() {}

  ngOnInit(): void {}
}
