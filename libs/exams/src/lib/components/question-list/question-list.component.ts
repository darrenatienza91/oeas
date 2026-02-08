import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { QuestionList } from '@batstateu/data-models';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  imports: [ReactiveFormsModule, FormsModule, NgZorroAntdModule, RouterLink, CommonModule],
  selector: 'batstateu-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.less'],
})
export class QuestionListComponent implements OnInit {
  public questionList = input<QuestionList[]>();
  @Output() deleteRecord = new EventEmitter<QuestionList>();
  @Output() search = new EventEmitter<string>();
  searchText = '';
  constructor(private modal: NzModalService) {}

  ngOnInit(): void {}

  delete(questionListDetail: QuestionList) {
    this.modal.confirm({
      nzTitle: 'Delete Record',
      nzContent: `Are you sure you want to delete question with name <b>${questionListDetail.description}</b>?`,
      nzOnOk: () => {
        this.deleteRecord.emit(questionListDetail);
      },
    });
  }

  onSearchChange(criteria: string) {
    this.search.emit(criteria);
  }
}
