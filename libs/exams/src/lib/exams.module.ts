import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExamListComponent } from './components/exam-list/exam-list.component';
import { ExamAttemptListViewComponent } from './containers/exam-attempts/exam-attempt-list-view/exam-attempt-list-view.component';
import { ExamRecordingViewComponent } from './components/exam-recording-view/exam-recording-view.component';
import { AttemptAnswerListViewComponent } from './containers/exam-attempts/attempt-answers/attempt-answer-list-view/attempt-answer-list-view.component';
import { AttemptAnswersComponent } from './containers/exam-attempts/attempt-answers/attempt-answers.component';
import { ExamRecordingComponent } from './containers/exam-recording/exam-recording.component';
import { ExamAttemptsComponent } from './containers/exam-attempts/exam-attempts.component';
import { AttemptAnswerComponent } from './containers/exam-attempts/attempt-answer/attempt-answer.component';
import { ExamFormViewComponent } from './components/exam-form-view/exam-form-view.component';
import { ExamFormComponent } from './containers/exam-form/exam-form.component';
import { AttemptAnswerFormViewComponent } from './containers/exam-attempts/attempt-answer/attempt-answer-form-view/attempt-answer-form-view.component';
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
    ExamAttemptListViewComponent,
    AttemptAnswerFormViewComponent,
    ExamRecordingViewComponent,
    AttemptAnswerListViewComponent,
    AttemptAnswersComponent,
    ExamRecordingComponent,
    ExamAttemptsComponent,
    AttemptAnswerComponent,
    ExamFormViewComponent,
    AttemptAnswerFormViewComponent,
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
      {
        path: ':examId/attempts/:attemptId/results',
        component: AttemptAnswersComponent,
      },
      {
        path: ':examId/attempts/:attemptId/results/:examAnsId',
        component: AttemptAnswerComponent,
      },
      { path: ':examId/attempts', component: ExamAttemptsComponent },
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
