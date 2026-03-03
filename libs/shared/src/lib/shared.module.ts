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
export * from './services/exams/exams.service';
export * from './services/question/question.service';
export * from './services/take-exam/take-exam.service';
export * from './guards/exam/exam.guard';
export * from './validators/confirm-password-validator';
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, NgZorroAntdModule, RouterModule, StatusPipe],

  exports: [StatusPipe],
})
export class SharedModule {}
