import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';

import { StatusPipe } from './pipes/status/status.pipe';

export * from './shared';
export * from './services/user/user.service';
export * from './services/section/section.service';
export * from './services/department/department.service';
export * from './services/user-type/user-type.service';
export * from '../../../exams/src/lib/services/exams/exams.service';
export * from './services/question/question.service';
export * from './guards/exam/exam.guard';
export * from './validators/confirm-password-validator';
export * from './builders/http-params-builder';
export * from './services/base-api.service';
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, NgZorroAntdModule, RouterModule, StatusPipe],

  exports: [StatusPipe],
})
export class SharedModule {}
