import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExamListComponent } from './components/exam-list/exam-list.component';
import { ExamTakersListComponent } from './components/exam-takers-list/exam-takers-list.component';
import { ExamRecordingViewComponent } from './components/exam-recording-view/exam-recording-view.component';
import { ExamResultListComponent } from './components/exam-result-list/exam-result-list.component';
import { ExamResultComponent } from './containers/exam-result/exam-result.component';
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
import { ExamInstructionViewComponent } from './components/exam-instruction-view/exam-instruction-view.component';
import { TakeExamComponent } from './containers/take-exam/take-exam.component';
import { TakeExamControlComponent } from './components/take-exam-control/take-exam-control.component';
import { TakeExamRecordingComponent } from './containers/take-exam-recording/take-exam-recording.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TakeExamQuestionViewComponent } from './components/take-exam-question-view/take-exam-question-view.component';
import { DataModelsModule } from '@batstateu/data-models';
import { TakeExamResultComponent } from './containers/take-exam-result/take-exam-result.component';
import { TakeExamResultViewComponent } from './components/take-exam-result-view/take-exam-result-view.component';
import { SharedModule } from '@batstateu/shared';
import { TakeExamCameraViewComponent } from './components/take-exam-camera-view/take-exam-camera-view.component';
import { NgxEditorModule } from 'ngx-editor';
import { StatusPipe } from 'libs/shared/src/lib/pipes/status/status.pipe';

@NgModule({
  imports: [
    ExamListComponent,
    ExamFormComponent,
    ExamTakersListComponent,
    ExamItemPointsFormViewComponent,
    ExamRecordingViewComponent,
    ExamResultListComponent,
    ExamResultComponent,
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
    TakeExamRecordingComponent,
    TakeExamControlComponent,
    TakeExamQuestionViewComponent,
    TakeExamResultComponent,
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
      // { path: ':examId/form', component: ExamFormComponent },
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
      // { path: ':examId/take-exam', component: TakeExamComponent },
      // { path: ':examId/questions', component: QuestionsComponent },
      // {
      //   path: ':examId/questions/:questionId/edit',
      //   component: QuestionFormComponent,
      // },
      // { path: ':examId/questions/add', component: QuestionFormComponent },
      // { path: ':examId/result', component: TakeExamResultComponent },
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
