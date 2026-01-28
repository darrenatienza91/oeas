import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuestionList } from '@batstateu/data-models';
import { ExamsModule } from '@batstateu/exams';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  imports: [ExamsModule],
  selector: 'batstateu-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.less'],
})
export class QuestionListComponent implements OnInit {
  @Input() questionList: QuestionList[] = [];
  @Output() deleteRecord = new EventEmitter<number>();
  @Output() search = new EventEmitter<string>();
  searchText = '';
  constructor(private modal: NzModalService) { }

  ngOnInit(): void { }

  delete(questionListDetail: QuestionList) {
    this.modal.confirm({
      nzTitle: 'Delete Record',
      nzContent: `Are you sure you want to delete question with name <b>${questionListDetail.question}</b>?`,
      nzOnOk: () => {
        this.deleteRecord.emit(questionListDetail.id);
      },
    });
  }

  onSearchChange(criteria: string) {
    this.search.emit(criteria);
  }
}
