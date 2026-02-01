import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ExamTakerResultList } from '@batstateu/data-models';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';

@Component({
  imports: [ReactiveFormsModule, FormsModule, NgZorroAntdModule, RouterLink, CommonModule],
  selector: 'batstateu-exam-result-list',
  templateUrl: './exam-result-list.component.html',
  styleUrls: ['./exam-result-list.component.less'],
})
export class ExamResultListComponent implements OnInit {
  @Input() examTakerResultList: ExamTakerResultList[] = [];
  @Output() search = new EventEmitter<string>();
  searchText = '';
  onSearchChange(criteria: string) {
    this.search.emit(criteria);
  }

  constructor() {}

  ngOnInit(): void {}
}
