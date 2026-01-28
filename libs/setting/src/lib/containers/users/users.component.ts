import { Component, OnInit } from '@angular/core';
import { UserDetail } from '@batstateu/data-models';
import { UserService } from '@batstateu/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, switchMap, take } from 'rxjs';
import { UserListComponent } from '../../components/user-list/user-list.component';

@Component({
  imports: [UserListComponent],
  selector: 'batstateu-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less'],
})
export class UsersComponent implements OnInit {
  userList!: UserDetail[];
  private searchSubject$ = new BehaviorSubject<string>('');

  onResetPassword({ userId, userDetailId }: any) {
    this.userService
      .resetPassword(userId)
      .pipe(
        switchMap(() => this.userService.updateResetPasswordDefaultStatus(userDetailId)),
        take(1),
      )
      .subscribe(() => {
        this.getAll('');
        this.modal.info({
          nzTitle: 'Reset Password',
          nzContent: `Password has been reset to default`,
        });
      });
  }
  onDelete(userDetail: UserDetail) {
    this.userService.deleteUser(userDetail.user_id).subscribe(() => {
      this.getAll('');
    });
  }
  constructor(private userService: UserService, private modal: NzModalService) { }

  ngOnInit(): void {
    this.getAll('');

    this.searchSubject$
      .asObservable()
      .pipe(
        map((val) => val.trim()),
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe((val) => this.getAll(val));
  }

  getAll(criteria: string) {
    this.userService.getAll(criteria).subscribe((val: UserDetail[]) => {
      this.userList = val;
    });
  }
  onSearch(val: string) {
    this.searchSubject$.next(val);
  }
}
