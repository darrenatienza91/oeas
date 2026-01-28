import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './containers/users/users.component';
import { UserListComponent } from './components/user-list/user-list.component';

import { UserFormComponent } from './containers/user-form/user-form.component';
import { SharedModule } from '@batstateu/shared';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgZorroAntdModule,
    SharedModule,
    UsersComponent, UserListComponent, UserFormComponent,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', redirectTo: 'users' },
      { path: 'users', component: UsersComponent },
      { path: 'users/:id/edit', component: UserFormComponent },
    ]),
  ],
})
export class SettingModule { }
