import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  Inject,
  NgZone,
  HostListener,
} from '@angular/core';

import { AsyncPipe, Location } from '@angular/common';
import { TakeExamRecordingComponent } from '../take-exam-recording/take-exam-recording.component';
import {
  Exam,
  ExamAnswer,
  ExamState,
  TakeExamControlState,
  TakerExamQuestion,
} from '@batstateu/data-models';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamsService, TakeExamService, UserService } from '@batstateu/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { APP_CONFIG } from '@batstateu/app-config';
import { BehaviorSubject, interval } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromAuth from '@batstateu/auth';
// import { CdTimerComponent } from 'angular-cd-timer';
import { TakeExamCameraViewComponent } from '../../components/take-exam-camera-view/take-exam-camera-view.component';
import { ExamInstructionViewComponent } from '../../components/exam-instruction-view/exam-instruction-view.component';
import { TakeExamQuestionViewComponent } from '../../components/take-exam-question-view/take-exam-question-view.component';
import { TakeExamControlComponent } from '../../components/take-exam-control/take-exam-control.component';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
@Component({
  imports: [
    NgZorroAntdModule,
    ExamInstructionViewComponent,
    TakeExamQuestionViewComponent,
    TakeExamControlComponent,
    TakeExamRecordingComponent,
    AsyncPipe,
  ],
  selector: 'batstateu-take-exam',
  templateUrl: './take-exam.component.html',
  styleUrls: ['./take-exam.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TakeExamComponent implements OnInit {
  @ViewChild(TakeExamRecordingComponent)
  takeExamRecording!: TakeExamRecordingComponent;
  @ViewChild(TakeExamCameraViewComponent)
  takeExamCameraView!: TakeExamCameraViewComponent;
  @ViewChild('cdTimer')
  // cdTimer!: CdTimerComponent;
  examDetail!: Exam;
  examTitle = '';
  TakeExamStateEnum = ExamState;
  TakeExamControlStateEnum = TakeExamControlState;
  takeExamState = ExamState.instructionView;
  takeExamControlState = TakeExamControlState.startRecordView;
  isStartExam = false;
  enableNextButton = false;
  enablePreviousButton = false;
  examDetailSubject$ = new BehaviorSubject<Exam | null>(null);
  examDetail$ = this.examDetailSubject$.asObservable();
  userDetailId = 0;
  takerExamId!: number;
  examId!: number;
  questions!: TakerExamQuestion[];
  currentQuestion!: TakerExamQuestion;
  currentQuestionSubject$ = new BehaviorSubject<TakerExamQuestion | null>(null);
  currentQuestion$ = this.currentQuestionSubject$.asObservable();
  questionCount = 1;
  questionIdx = 0;
  question = '';
  questionId = 0;
  startCdCount = 1;
  limitSubject$ = new BehaviorSubject<number>(0);
  videoVisibleSubject$ = new BehaviorSubject<boolean>(false);
  limit$ = this.limitSubject$.asObservable();
  videoVisible$ = this.videoVisibleSubject$.asObservable();
  cameraVisible = false;
  hasInactiveStatus = false;
  tabActiveSubject$ = new BehaviorSubject<boolean | null>(null);
  tabActive$ = this.tabActiveSubject$.asObservable();
  takeExamInterval: any;
  timeLeft = 30;
  initial = true;
  timerExitSource$ = interval(1000);
  timerExitSubcription$!: any;
  tabActive = true;

  startTimerExitExam() {
    this.timerExitSubcription$ = this.timerExitSource$.subscribe((val) => {
      console.log(val);
      console.log(this.timeLeft);
      if (this.timeLeft <= 0) {
        this.onFinishExamination();
        setTimeout(() => this.timerExitSubcription$.unsubscribe(), 100);
      } else {
        this.timeLeft--;
      }
    });
  }

  @HostListener('document:visibilitychange') documentVisibilityEvent() {
    if (
      document.visibilityState === 'hidden' &&
      this.takeExamState == ExamState.takeExamQuestionView
    ) {
      this.tabActive = false;
      console.log('start exit timer');
      this.hasInactiveStatus = true;
      this.startTimerExitExam();

      this.tabActiveSubject$.next(false);
    } else if (this.takeExamState != ExamState.instructionView) {
      this.tabActive = true;
      console.log('stop exit timer');
      setTimeout(() => this.timerExitSubcription$.unsubscribe(), 1000);
      this.tabActiveSubject$.next(true);
      if (this.timeLeft > 0) {
        this.modal.warning({
          nzTitle: 'Inactivity Limit',
          nzContent: `You only have ${this.timeLeft} seconds to be inactive. Examination will exit automatically after limit has reach!`,
        });
      }
    }
  }

  ngOnInit(): void {
    this.examId = Number(this.route.snapshot.paramMap.get('examId'));
    this.getUser();
    this.checkExamStatus();
    this.getExamInstruction();
  }
  checkExamStatus() {
    this.examService.get(this.examId).subscribe((val) => {
      if (!val.isActive) {
        this.modal.error({
          nzTitle: 'Not Active Exam',
          nzContent: `Examination is not Active! <br/> Click Ok to proceed.`,
          nzOnOk: () => {
            this.goToResults();
          },
        });
      } else {
        this.checkHasExamRecord();
      }
    });
  }
  checkHasExamRecord() {
    this.takeExamService
      .getTakerExamByUserDetaiIdExamId(this.userDetailId, this.examId)
      .subscribe((val) => {
        if (val) {
          this.modal.error({
            nzTitle: 'Finished examination',
            nzContent: `You already completed the exam. <br/> Click Ok to view result`,
            nzOnOk: () => {
              this.goToResults();
            },
          });
        }
      });
  }
  onCompleteTimer() {
    this.modal.info({
      nzTitle: 'Your time is up',
      nzContent: `You completed the exam, click Ok to finish the exam.`,
      nzOnOk: () => {
        this.onFinishExamination();
      },
    });
  }
  onStartRecord() {
    this.modal.confirm({
      nzTitle: 'Start Examination',
      nzContent: `Starting the examination will record your screen. Do you want to continue?`,
      nzOnOk: () => {
        this.takeExamService
          .addTakerExam({
            userDetailId: this.userDetailId,
            examId: this.examId,
            recUrl: '',
          })
          .subscribe((val) => {
            this.takerExamId = val;

            this.takeExamRecording.onStartRecord();
          });
      },
    });
  }
  getQuestions() {
    this.takeExamService.getAnswers(this.userDetailId).subscribe((val) => {
      const answerArr = val.map((item: any) => item['questionId']);
      this.takeExamService.getQuestions(this.examId, answerArr).subscribe((val2) => {
        if (val2.length > 0) {
          if (this.questionIdx < 0 || this.questionIdx > val2.length - 1) {
            this.modal.error({
              nzTitle: 'Fetching questions',
              nzContent: `No more questions available`,
              nzOnOk: () => {
                //
                this.questionIdx =
                  this.questionIdx > 0
                    ? this.questionIdx >= val2.length - 1
                      ? val2.length - 1
                      : this.questionIdx
                    : 0;
                this.questionCount = val2.length;
                this.currentQuestion = val2[this.questionIdx];
                this.questionId = val2[this.questionIdx].id;
                this.currentQuestionSubject$.next(this.currentQuestion);
              },
            });
          } else {
            this.currentQuestion = val2[this.questionIdx];
            this.questionId = val2[this.questionIdx].id;
            this.currentQuestionSubject$.next(this.currentQuestion);
          }
        } else {
          this.modal.info({
            nzTitle: 'Completed Exam',
            nzContent: `You completed the exam, click Ok to finish the exam.`,
            nzOnOk: () => {
              this.onFinishExamination();
            },
          });
        }
      });
    });
  }
  onStartExam() {
    this.cameraVisible = true;
    this.videoVisibleSubject$.next(true);
    // this.cdTimer.start();
    this.getQuestions();
    this.takeExamState = ExamState.takeExamQuestionView;
  }
  onSubmitAnswer(answer: string) {
    const examAnswer: ExamAnswer = {
      userDetailId: this.userDetailId,
      questionId: this.questionId,
      examId: this.examId,
      answer: answer,
      points: 0,
    };

    this.takeExamService.addAnswer(examAnswer).subscribe(() => {
      this.getQuestions();
    });
  }
  onNexQuestion() {
    this.questionIdx++;
    this.getQuestions();
  }
  onPrevQuestion() {
    this.questionIdx--;
    this.getQuestions();
  }
  onBack() {
    this.location.back();
  }
  onFinishExamination() {
    this.takeExamRecording.onStopRecord();
  }
  getExamInstruction() {
    this.examService.get(this.examId).subscribe((val) => {
      this.examDetailSubject$.next(val);
      this.examDetail = val;
      this.examTitle = val.name;
      this.startCdCount = val.duration * 60;
      this.limitSubject$.next(this.startCdCount);
    });
  }
  onUploadRecord(data: any) {
    if (this.hasInactiveStatus) {
      this.takeExamService.upload(data).subscribe({
        next: (value) =>
          this.takeExamService.get(this.takerExamId).subscribe((val) =>
            this.takeExamService
              .updateTakerExam(this.takerExamId, {
                ...val,
                recUrl: `${this.appConfig.UPLOAD_URL}/uploads/${data.name}`,
              })
              .subscribe((val) => {
                this.goToResults();
              }),
          ),
        error: (err) => console.log(err),
      });
    } else {
      this.goToResults();
    }
  }
  goToResults() {
    this.zone.run(() => {
      this.router.navigate([`exams/${this.examId}/result`]);
    });
  }
  getUser() {
    this.store.select(fromAuth.getAuthSuccess).subscribe((val) => {
      this.userDetailId = val?.user.userDetailId || 0;
    });
  }
  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private examService: ExamsService,
    private modal: NzModalService,
    private takeExamService: TakeExamService,
    @Inject(APP_CONFIG) private appConfig: any,
    private store: Store<fromAuth.State>,
    private userService: UserService,
    private zone: NgZone,
  ) {}
}
