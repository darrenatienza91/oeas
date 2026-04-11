import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExamListComponent } from './components/exam-list/exam-list.component';
import { ExamTakersListComponent } from './components/exam-takers-list/exam-takers-list.component';
import { ExamRecordingViewComponent } from './components/exam-recording-view/exam-recording-view.component';
import { ExamResultListComponent } from './components/exam-result-list/exam-result-list.component';
import { ExamResultsComponent } from './containers/exam-results/exam-results.component';
import { ExamRecordingComponent } from './containers/exam-recording/exam-recording.component';
import { ExamTakersComponent } from './containers/exam-takers/exam-takers.component';
import { ExamItemPointsComponent } from './containers/exam-item-points/exam-item-points.component';
import { ExamFormViewComponent } from './components/exam-form-view/exam-form-view.component';
import { ExamFormComponent } from './containers/exam-form/exam-form.component';
import { ExamItemPointsFormViewComponent } from './components/exam-item-points-form-view/exam-item-points-form-view.component';
import { ExamsComponent } from './containers/exams/exams.component';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionsComponent } from './containers/questions/questions.component';
import { QuestionFormComponent } from './containers/question-form/question-form.component';
import { QuestionFormViewComponent } from './components/question-form-view/question-form-view.component';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { ExamInstructionViewComponent } from './containers/take-exam/exam-instruction-view/exam-instruction-view.component';
import { TakeExamComponent } from './containers/take-exam/take-exam.component';
import { TakeExamControlComponent } from './containers/take-exam/take-exam-control/take-exam-control.component';
import { TakeExamScreenRecordingComponent } from './containers/take-exam/take-exam-screen-recording/take-exam-screen-recording.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DataModelsModule } from '@batstateu/data-models';
import { SharedModule } from '@batstateu/shared';
import { TakeExamCameraViewComponent } from './containers/take-exam/take-exam-camera-view/take-exam-camera-view.component';
import { NgxEditorModule } from 'ngx-editor';
import { StatusPipe } from 'libs/shared/src/lib/pipes/status/status.pipe';
import { TakeExamQuestionViewComponent } from './containers/take-exam/take-exam-question-view/take-exam-question-view.component';
import { takeExamGuard } from './containers/take-exam/guards/take-exam/take-exam.guard';
import { ExamAttemptResultPageComponent } from './containers/take-exam/exam-attempt-result-page/exam-attempt-result-page.component';
import { TakeExamResultViewComponent } from './containers/take-exam/exam-attempt-result-page/take-exam-result-view/take-exam-result-view.component';

@NgModule({
  imports: [
    ExamListComponent,
    ExamFormComponent,
    ExamTakersListComponent,
    ExamItemPointsFormViewComponent,
    ExamRecordingViewComponent,
    ExamResultListComponent,
    ExamResultsComponent,
    ExamRecordingComponent,
    ExamTakersComponent,
    ExamItemPointsComponent,
    ExamFormViewComponent,
    ExamItemPointsFormViewComponent,
    ExamsComponent,
    QuestionsComponent,
    QuestionFormComponent,
    QuestionFormViewComponent,
    QuestionListComponent,
    ExamInstructionViewComponent,
    TakeExamComponent,
    TakeExamScreenRecordingComponent,
    TakeExamControlComponent,
    TakeExamQuestionViewComponent,
    ExamAttemptResultPageComponent,
    TakeExamResultViewComponent,
    TakeExamCameraViewComponent,
    CommonModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    DataModelsModule,
    FormsModule,
    SharedModule,
    NgxEditorModule,
    RouterModule.forChild([
      { path: '', component: ExamsComponent },
      { path: 'form', component: ExamFormComponent },
      { path: ':examId/form', component: ExamFormComponent },
      // { path: 'item-points', component: ExamItemPointsComponent },
      // {
      //   path: ':examId/takers/:takerId/recording',
      //   component: ExamRecordingComponent,
      // },
      // {
      //   path: ':examId/takers/:takerId/results',
      //   component: ExamResultComponent,
      // },
      // {
      //   path: ':examId/takers/:takerId/results/:examAnsId',
      //   component: ExamItemPointsComponent,
      // },
      // { path: ':examId/takers', component: ExamTakersComponent },
      // {
      //   path: ':examId/takers/:takerId/recording',
      //   component: ExamRecordingComponent,
      // },
      { path: ':examId/take-exam', component: TakeExamComponent, canActivate: [takeExamGuard] },
      { path: ':examId/questions', component: QuestionsComponent },
      {
        path: ':examId/questions/:id/edit',
        component: QuestionFormComponent,
      },
      { path: ':examId/questions/add', component: QuestionFormComponent },
      { path: ':examId/result', component: ExamAttemptResultPageComponent },
    ]),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  exports: [
    NgZorroAntdModule,
    ReactiveFormsModule,
    NgxEditorModule,
    FormsModule,
    RouterModule,
    StatusPipe,
  ],
})
export class ExamsModule {}
