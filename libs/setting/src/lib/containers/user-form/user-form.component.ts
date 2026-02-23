import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DepartmentService, SectionService, UserService } from '@batstateu/shared';
import { AuthPayload, User, UserFormType, UserType } from '@batstateu/data-models';
import { Store } from '@ngrx/store';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import * as fromAuth from '@batstateu/auth';
import { ActivatedRoute } from '@angular/router';
import { UserFormViewComponent } from './user-form-view/user-form-view.component';
@Component({
  imports: [UserFormViewComponent],
  selector: 'batstateu-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.less'],
})
export class UserFormComponent {
  private store = inject(Store<fromAuth.State>);

  private userService = inject(UserService);
  private modal = inject(NzModalService);
  private route = inject(ActivatedRoute);
  private departmentService = inject(DepartmentService);
  private sectionService = inject(SectionService);
  private id = Number(this.route.snapshot.paramMap.get('id'));
  public user = toSignal(this.userService.getUserDetail(this.id));

  authSuccess$!: Observable<AuthPayload | null>;
  userId!: number;
  isActiveEnable = false;
  public departments = toSignal(this.departmentService.getAll(), { initialValue: [] });
  public sections = toSignal(this.sectionService.getAll(), { initialValue: [] });
  userTypes!: UserType[];
  code!: string;
  userFormType = UserFormType.FACULTY_ADMIN;
  isSetting = true;

  constructor() {
    this.authSuccess$ = this.store.select(fromAuth.getAuthSuccess);
  }

  onSave(user: User) {
    const { firstName, middleName, lastName, userName, ...safeUser } = user;

    this.userService.save(this.id, safeUser).subscribe(() =>
      this.modal.success({
        nzTitle: 'Success',
        nzContent: 'Record has been saved',
        nzOkText: 'Ok',
      }),
    );
  }
}
