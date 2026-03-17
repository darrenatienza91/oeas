import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  NgZone,
  HostListener,
  signal,
  inject,
} from '@angular/core';

import { AsyncPipe, Location } from '@angular/common';
import { TakeExamRecordingComponent } from './take-exam-recording/take-exam-recording.component';
import {
  Exam,
  ExamState,
  TakeExamControlState,
  TakerExamDetail,
  TakerExamQuestion,
} from '@batstateu/data-models';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamsService, TakeExamService, UserService } from '@batstateu/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { APP_CONFIG } from '@batstateu/app-config';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  interval,
  map,
  merge,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromAuth from '@batstateu/auth';
// import { CdTimerComponent } from 'angular-cd-timer';
import { TakeExamCameraViewComponent } from './take-exam-camera-view/take-exam-camera-view.component';
import { ExamInstructionViewComponent } from './exam-instruction-view/exam-instruction-view.component';

import { TakeExamControlComponent } from './take-exam-control/take-exam-control.component';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { TakeExamQuestionViewComponent } from './take-exam-question-view/take-exam-question-view.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { handleExamInitializationErrors } from './examination-initialization-error-handler copy';

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
export class TakeExamComponent {
  private readonly location: Location = inject(Location);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly examService: ExamsService = inject(ExamsService);
  private readonly modal: NzModalService = inject(NzModalService);
  private readonly takeExamService: TakeExamService = inject(TakeExamService);
  private readonly appConfig = inject<{ UPLOAD_URL: string }>(APP_CONFIG);
  private readonly store: Store<fromAuth.State> = inject(Store<fromAuth.State>);
  private readonly userService: UserService = inject(UserService);
  private readonly zone: NgZone = inject(NgZone);

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
  questions!: TakerExamQuestion[];
  public currentQuestion = signal<TakerExamQuestion | null>(null);

  questionCount = 1;
  questionIdx = 0;

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
  private readonly examTaker = signal<TakerExamDetail | null>(null);
  private readonly examId = Number(this.route.snapshot.paramMap.get('examId'));

  private readonly submitAnswer$ = new Subject<string>();
  private readonly nextQuestion$ = new Subject<void>();
  private readonly previousQuestion$ = new Subject<void>();

  private readonly examFlow$ = merge(
    this.submitAnswer$.pipe(
      switchMap((answer) =>
        this.takeExamService.addAnswer(this.takerExamId, this.currentQuestionId, {
          answerText: answer,
        }),
      ),
      switchMap(() => this.takeExamService.moveNextQuestion(this.takerExamId)),
      this.handleQuestionNavigation('next'),
    ),

    this.nextQuestion$.pipe(
      switchMap(() => this.takeExamService.moveNextQuestion(this.takerExamId)),
      this.handleQuestionNavigation('next'),
    ),

    this.previousQuestion$.pipe(
      switchMap(() => this.takeExamService.movePreviousQuestion(this.takerExamId)),
      this.handleQuestionNavigation('previous'),
    ),
  )
    .pipe(takeUntilDestroyed())
    .subscribe();

  private readonly initializedExam$ = this.initializedExam().pipe(takeUntilDestroyed()).subscribe();

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

  private initializedExam(): Observable<void> {
    return this.examService.get(this.examId).pipe(
      tap((exam) => {
        if (!exam.isActive) {
          throw new Error('EXAM_NOT_ACTIVE');
        }

        if (!exam.hasQuestions) {
          throw new Error('NO_QUESTIONS');
        }
      }),

      tap((exam) => {
        this.examDetailSubject$.next(exam);
        this.examDetail = exam;
        this.examTitle = exam.name;
        this.startCdCount = exam.duration * 60;
        this.limitSubject$.next(this.startCdCount);
      }),

      switchMap(() => this.takeExamService.getExamTakerByExamId(this.examId)),

      tap((record) => {
        if (record) {
          throw new Error('EXAM_ALREADY_FINISHED');
        }
      }),

      map(() => void 0),

      catchError((err) => {
        handleExamInitializationErrors(
          err,
          this.modal,
          () => this.goToDashBoard(),
          () => this.goToResults(),
        );
        return EMPTY;
      }),
    );
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
  public onStartRecord(): void {
    this.modal.confirm({
      nzTitle: 'Start Examination',
      nzContent: `Starting the examination will record your screen. Do you want to continue?`,
      nzOnOk: () => {
        this.startExamAndLoadQuestion();
      },
    });
  }

  private loadCurrentQuestion(attemptId: number) {
    return this.takeExamService.getCurrentQuestion(attemptId);
  }

  private startExamAndLoadQuestion(): void {
    this.takeExamService
      .addExamTaker(this.examId)
      .pipe(
        tap((val) => {
          this.examTaker.set(val);
          this.takeExamRecording.onStartRecord();
        }),
        map((val) => val.id),
        switchMap((id) => this.loadCurrentQuestion(id)),
        tap((question) => {
          if (!question) {
            throw new Error('NO_CURRENT_QUESTION');
          }

          this.currentQuestion.set(question);
        }),
        catchError((err) => {
          if (err.message === 'NO_CURRENT_QUESTION') {
            this.modal.error({
              nzTitle: 'Fetching questions',
              nzContent: `No more questions available`,
            });
          }

          return EMPTY;
        }),
      )
      .subscribe();
  }

  onStartExam() {
    this.cameraVisible = true;
    this.videoVisibleSubject$.next(true);
    // this.cdTimer.start();
    this.takeExamState = ExamState.takeExamQuestionView;
  }

  private get takerExamId(): number {
    return this.examTaker()?.id ?? 0;
  }

  private get currentQuestionId(): number {
    return this.currentQuestion()?.id ?? 0;
  }

  public onSubmitAnswer(answer: string) {
    this.submitAnswer$.next(answer);
  }

  public onNextQuestion(): void {
    this.nextQuestion$.next();
  }

  private handleQuestionNavigation(direction: 'next' | 'previous'): (
    source$: Observable<{
      isLast?: boolean;
      isFirst?: boolean;
    }>,
  ) => Observable<TakerExamQuestion> {
    return (source$: Observable<{ isLast?: boolean; isFirst?: boolean }>) =>
      source$.pipe(
        switchMap((val) => {
          if (direction === 'next' && val?.isLast) {
            this.showNoMoreQuestionAvailableModal();
            return EMPTY;
          }

          if (direction === 'previous' && val?.isFirst) {
            this.showNoMoreQuestionAvailableModal();
            return EMPTY;
          }

          return this.loadCurrentQuestion(this.takerExamId);
        }),
        tap((question) => {
          if (!question) {
            this.showNoMoreQuestionAvailableModal();
            return;
          }

          this.currentQuestion.set(question);
        }),
      );
  }

  public onPreviousQuestion(): void {
    this.previousQuestion$.next();
  }

  private showNoMoreQuestionAvailableModal(): void {
    this.modal.error({
      nzTitle: 'Fetching questions',
      nzContent: `No more questions available`,
    });
  }

  private showCompletedExamModal(): void {
    this.modal.info({
      nzTitle: 'Completed Exam',
      nzContent: `You completed the exam, click Ok to finish the exam.`,
      nzOnOk: () => {
        this.onFinishExamination();
      },
    });
  }

  onBack() {
    this.location.back();
  }
  onFinishExamination() {
    this.takeExamRecording.onStopRecord();
  }

  onUploadRecord(data: any) {
    if (this.hasInactiveStatus) {
      this.takeExamService.upload(data).subscribe({
        next: (value) =>
          this.takeExamService.get(this.examTaker()?.id ?? 0).subscribe((val) =>
            this.takeExamService
              .updateTakerExam(this.examTaker()?.id ?? 0, {
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
  private goToResults() {
    this.router.navigate([`exams/${this.examId}/result`]);
  }

  private goToDashBoard() {
    this.router.navigate([`dashboard`]);
  }
}
