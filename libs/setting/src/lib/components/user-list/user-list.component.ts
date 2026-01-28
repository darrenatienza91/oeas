import {
  Component,
  EventEmitter,
  Input, Output
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserDetail } from '@batstateu/data-models';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { StatusPipe } from 'libs/shared/src/lib/pipes/status/status.pipe';
import { RouterModule } from '@angular/router';
@Component({
  imports: [NgZorroAntdModule, ReactiveFormsModule, FormsModule, StatusPipe, RouterModule],
  selector: 'batstateu-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less'],
})
export class UserListComponent {
  @Input() userList!: UserDetail[];
  @Output() deleteRecord = new EventEmitter<UserDetail>();
  @Output() search = new EventEmitter<string>();
  @Output() resetPassword = new EventEmitter();
  searchText = '';

  constructor(private modal: NzModalService) { }

  delete(userdDetail: UserDetail) {
    this.modal.confirm({
      nzIconType: 'question-circle',
      nzTitle: 'Delete Record',
      nzContent: `Are you sure you want to delete user with name <b>${userdDetail.firstName} ${userdDetail.lastName}</b>?`,
      nzOnOk: () => {
        this.deleteRecord.emit(userdDetail);
      },
    });
  }
  onResetPassword(userdDetail: UserDetail) {
    this.modal.confirm({
      nzTitle: 'Reset Password',
      nzContent: `Are you sure you want to reset password of user with name <b>${userdDetail.firstName} ${userdDetail.lastName}</b>?`,
      nzOnOk: () => {
        this.resetPassword.emit({
          userId: userdDetail.user_id,
          userDetailId: userdDetail.id,
        });
      },
    });
  }

  onSearchChange(val: any) {
    this.search.emit(val);
  }
}
