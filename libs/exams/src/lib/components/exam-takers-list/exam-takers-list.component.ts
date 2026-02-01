import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ExamTakerList } from '@batstateu/data-models';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';

@Component({
  imports: [FormsModule, NgZorroAntdModule, RouterLink, CommonModule],
  selector: 'batstateu-exam-takers-list',
  templateUrl: './exam-takers-list.component.html',
  styleUrls: ['./exam-takers-list.component.less'],
})
export class ExamTakersListComponent implements OnInit {
  @Input() examTakerList: ExamTakerList[] = [];
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
