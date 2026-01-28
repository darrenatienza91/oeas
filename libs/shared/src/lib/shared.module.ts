import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgZorroAntdModule } from "@batstateu/ng-zorro-antd";
import { UserFormViewComponent } from "./components/user-form-view/user-form-view.component";
import { StatusPipe } from "./pipes/status/status.pipe";

export * from './shared';
export * from './services/user/user.service';
export * from './services/section/section.service';
export * from './services/department/department.service';
export * from './services/user-type/user-type.service';
export * from './services/exams/exams.service';
export * from './services/question/question.service';
export * from './services/take-exam/take-exam.service';
export * from './guards/exam/exam.guard';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    RouterModule,
    UserFormViewComponent,
    StatusPipe
  ],

  exports: [
    UserFormViewComponent,
    StatusPipe
  ]
})
export class SharedModule { }