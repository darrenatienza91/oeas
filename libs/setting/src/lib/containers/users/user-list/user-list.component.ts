import { Component, EventEmitter, input, output, Output, signal } from '@angular/core';
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
  public userList = input<UserDetail[]>([]);
  public deleteRecord = output<number>();
  public toggleIsActive = input<boolean>();
  @Output() search = new EventEmitter<string>();
  @Output() resetPassword = new EventEmitter();
  public changeStatus = output<{ id: number; isActive: boolean }>();
  public searchText = signal('');

  constructor(private modal: NzModalService) {}

  delete(userDetail: UserDetail) {
    this.modal.confirm({
      nzIconType: 'question-circle',
      nzTitle: 'Delete Record',
      nzContent: `Are you sure you want to delete user with name <b>${userDetail.firstName} ${userDetail.lastName}</b>?`,
      nzOnOk: () => {
        this.deleteRecord.emit(userDetail.id);
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
