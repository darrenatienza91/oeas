import {
  Component,
  EventEmitter,
  Input, Output
} from '@angular/core';
import { Exam } from '@batstateu/data-models';
import { ExamsModule } from '@batstateu/exams';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  imports: [ExamsModule],
  selector: 'batstateu-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.less'],
})
export class ExamListComponent {
  @Input() examList!: Exam[];
  @Input() isStudent!: boolean;
  @Output() deleteRecord = new EventEmitter<number>();
  @Output() search = new EventEmitter<string>();
  @Output() changeStatus = new EventEmitter();
  searchText = '';
  constructor(private modal: NzModalService) { }

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
  onChangeStatus(id?: number, status?: boolean) {
    this.changeStatus.emit({ id, status });
  }
}
