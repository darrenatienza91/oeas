import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Exam } from '@batstateu/data-models';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { StatusPipe } from 'libs/shared/src/lib/pipes/status/status.pipe';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  imports: [FormsModule, NgZorroAntdModule, RouterLink, CommonModule, StatusPipe],
  selector: 'batstateu-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.less'],
})
export class ExamListComponent {
  public examList = input<Exam[]>();
  @Input() isStudent!: boolean;
  @Output() deleteRecord = new EventEmitter<number | null>();
  @Output() search = new EventEmitter<string>();
  @Output() changeStatus = new EventEmitter();
  searchText = '';
  constructor(private modal: NzModalService) {}

  delete(examListDetail: Exam) {
    this.modal.confirm({
      nzTitle: 'Delete Record',
      nzContent: `Are you sure you want to delete exam with name <b>${examListDetail.name}</b>?`,
      nzOnOk: () => {
        this.deleteRecord.emit(examListDetail.id);
      },
    });
  }
  onSearchChange(criteria: string) {
    this.search.emit(criteria);
  }
  onChangeStatus(id?: number | null, status?: boolean) {
    this.changeStatus.emit({ id, status });
  }
}
