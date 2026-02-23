import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AuthPayload, UserDetail } from '@batstateu/data-models';
import { UserService } from '@batstateu/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from 'rxjs';
import { UserListComponent } from './user-list/user-list.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import * as fromAuth from '@batstateu/auth';

@Component({
  imports: [UserListComponent],
  selector: 'batstateu-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less'],
})
export class UsersComponent implements OnInit {
  private readonly userService = inject(UserService);
  private modal = inject(NzModalService);

  public userList = signal<UserDetail[]>([]);
  private readonly searchSubject$ = new BehaviorSubject<string>('');
  private readonly searchText = toSignal(this.searchSubject$, { initialValue: '' });
  private readonly store = inject(Store<fromAuth.State>);
  public auth = toSignal(this.store.select(fromAuth.getAuthSuccess), {
    initialValue: {} as AuthPayload,
  });

  public toggleIsActive = computed(() => this.auth()?.user.role === 'SuperAdmin');

  onResetPassword({ userId, userDetailId }: any) {
    // this.userService
    //   .resetPassword(userId)
    //   .pipe(
    //     switchMap(() => this.userService.updateResetPasswordDefaultStatus(userDetailId)),
    //     take(1),
    //   )
    //   .subscribe(() => {
    //     this.getAll('');
    //     this.modal.info({
    //       nzTitle: 'Reset Password',
    //       nzContent: `Password has been reset to default`,
    //     });
    //   });
  }

  public changeStatus({ id, isActive }: { id: number; isActive: boolean }): void {
    if (isActive) {
      this.userService
        .deActivate(id)
        .pipe(switchMap(() => this.userService.getAll(this.searchText())))
        .subscribe((val) => this.userList.set(val));
      return;
    }

    this.userService
      .activate(id)
      .pipe(switchMap(() => this.userService.getAll(this.searchText())))
      .subscribe((val) => this.userList.set(val));
  }

  onDelete(id: number) {
    this.userService
      .deleteUser(id)
      .pipe(switchMap(() => this.userService.getAll(this.searchText())))
      .subscribe((val) => this.userList.set(val));
  }
  constructor() {}

  ngOnInit(): void {
    this.searchSubject$
      .asObservable()
      .pipe(
        startWith(''),
        map((val) => val.trim()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((criteria) => this.userService.getAll(criteria)),
      )
      .subscribe((val) => this.userList.set(val));
  }

  onSearch(val: string) {
    this.searchSubject$.next(val);
  }
}
