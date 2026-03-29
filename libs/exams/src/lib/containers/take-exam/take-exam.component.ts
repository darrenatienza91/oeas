import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  NgZone,
  signal,
  inject,
  effect,
  OnInit,
  untracked,
  viewChild,
  computed,
} from '@angular/core';

import { Location } from '@angular/common';
import { TakeExamScreenRecordingComponent } from './take-exam-screen-recording/take-exam-screen-recording.component';
import {
  Exam,
  ExamState,
  TakeExamControlState,
  TakerExamDetail,
  TakerExamQuestion,
} from '@batstateu/data-models';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ExamsService,
  TakeExamService,
  UploadService,
  UserService,
  VideoJsPlayerWithRecord,
  VideoRecorderFacadeService,
} from '@batstateu/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { APP_CONFIG, AppConfig } from '@batstateu/app-config';
import {
  catchError,
  distinctUntilChanged,
  EMPTY,
  filter,
  fromEvent,
  interval,
  map,
  merge,
  Observable,
  skip,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromAuth from '@batstateu/auth';
import { TakeExamCameraViewComponent } from './take-exam-camera-view/take-exam-camera-view.component';
import { ExamInstructionViewComponent } from './exam-instruction-view/exam-instruction-view.component';

import { TakeExamControlComponent } from './take-exam-control/take-exam-control.component';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { TakeExamQuestionViewComponent } from './take-exam-question-view/take-exam-question-view.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { handleExamInitializationErrors } from './examination-initialization-error-handler copy';
import { CountdownTimerService } from '../../countdown-timer/countdown-timer.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  EXAMINATION_DURATION_COUNTDOWN,
  INACTIVE_COUNTDOWN,
  RECORDING_COUNTDOWN_TO_PAUSE,
} from './countdown-timer-injection-token';
import videojs from 'video.js';
import RecordRTC from 'recordrtc';
import { toSeconds } from './to-seconds';
import { toTimeFormatFromSeconds } from './to-time-format-from-seconds';

@Component({
  imports: [
    NgZorroAntdModule,
    ExamInstructionViewComponent,
    TakeExamQuestionViewComponent,
    TakeExamControlComponent,
    TakeExamScreenRecordingComponent,
  ],
  providers: [
    { provide: INACTIVE_COUNTDOWN, useClass: CountdownTimerService },
    { provide: RECORDING_COUNTDOWN_TO_PAUSE, useClass: CountdownTimerService },
    { provide: EXAMINATION_DURATION_COUNTDOWN, useClass: CountdownTimerService },
    VideoRecorderFacadeService,
  ],
  selector: 'batstateu-take-exam',
  templateUrl: './take-exam.component.html',
  styleUrls: ['./take-exam.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TakeExamComponent implements OnInit {
  private readonly location: Location = inject(Location);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly examService: ExamsService = inject(ExamsService);
  private readonly modal: NzModalService = inject(NzModalService);
  private readonly takeExamService: TakeExamService = inject(TakeExamService);
  public readonly appConfig = inject<AppConfig>(APP_CONFIG);
  private readonly store: Store<fromAuth.State> = inject(Store<fromAuth.State>);
  private readonly userService: UserService = inject(UserService);
  private readonly uploadService: UploadService = inject(UploadService);
  private readonly zone: NgZone = inject(NgZone);
  private readonly inActiveTabCountdownTimer = inject<CountdownTimerService>(INACTIVE_COUNTDOWN);
  public readonly examinationDurationCountdownTimer = inject<CountdownTimerService>(
    EXAMINATION_DURATION_COUNTDOWN,
  );
  private readonly recordingToPauseCountdownTimer = inject<CountdownTimerService>(
    RECORDING_COUNTDOWN_TO_PAUSE,
  );
  private readonly screenRecorderFacadeService = inject(VideoRecorderFacadeService);
  private readonly notificationService = inject(NzNotificationService);
  public readonly takeExamRecording =
    viewChild<TakeExamScreenRecordingComponent>('takeExamScreenRecorder');

  @ViewChild(TakeExamCameraViewComponent)
  takeExamCameraView!: TakeExamCameraViewComponent;
  TakeExamStateEnum = ExamState;
  TakeExamControlStateEnum = TakeExamControlState;
  public takeExamState = signal<ExamState>(ExamState.instructionView);
  takeExamControlState = TakeExamControlState.startRecordView;
  isStartExam = false;
  enableNextButton = false;
  enablePreviousButton = false;
  public examDetail = signal<Exam | null>(null);
  questions!: TakerExamQuestion[];
  public currentQuestion = signal<TakerExamQuestion | null>(null);
  public tabActive = signal<boolean>(false);

  questionCount = 1;
  questionIdx = 0;

  public examinationDurationInSeconds = signal<number>(0);

  public videoVisible = signal(true);
  cameraVisible = false;
  hasInactiveStatus = false;
  takeExamInterval: any;
  private readonly timeLeft = this.appConfig.inactiveTimeInSeconds;
  initial = true;
  timerExitSource$ = interval(1000);
  private readonly examTaker = signal<TakerExamDetail | null>(null);
  private readonly examId = Number(this.route.snapshot.paramMap.get('examId'));

  private readonly submitAnswer$ = new Subject<string>();
  private readonly nextQuestion$ = new Subject<void>();
  private readonly previousQuestion$ = new Subject<void>();

  public examinationDurationRemaining = computed(() => {
    return `Time Remaining: ${toTimeFormatFromSeconds(this.examinationDurationCountdownTimer.timeRemaining)}`;
  });

  private readonly examFlow$ = merge(
    this.submitAnswer$.pipe(
      switchMap((answer) =>
        this.takeExamService.addAnswer(this.examTakerId, this.currentQuestionId, {
          answerText: answer,
        }),
      ),
      switchMap(() => this.takeExamService.moveNextQuestion(this.examTakerId)),
      this.handleQuestionNavigation('next'),
    ),

    this.nextQuestion$.pipe(
      switchMap(() => this.takeExamService.moveNextQuestion(this.examTakerId)),
      this.handleQuestionNavigation('next'),
    ),

    this.previousQuestion$.pipe(
      switchMap(() => this.takeExamService.movePreviousQuestion(this.examTakerId)),
      this.handleQuestionNavigation('previous'),
    ),
  )
    .pipe(takeUntilDestroyed())
    .subscribe();

  private readonly initializedExam$ = this.initializedExam().pipe(takeUntilDestroyed()).subscribe();

  private readonly browserTabVisibility = merge(
    fromEvent(document, 'visibilitychange').pipe(map(() => document.visibilityState === 'visible')),
    fromEvent(globalThis, 'focus').pipe(map(() => true)),
    fromEvent(globalThis, 'blur').pipe(map(() => false)),
  )
    .pipe(
      filter(() => this.appConfig.allowInactiveTimePenalty),
      startWith(document.visibilityState === 'visible' && document.hasFocus()),
      distinctUntilChanged(),
      skip(6),
      tap((isActive) => {
        this.tabActive.set(isActive);
        if (this.takeExamState() != ExamState.takeExamQuestionView) {
          return;
        }

        if (!isActive) {
          this.onTabHidden();
          return;
        }

        this.onTabVisible();
      }),
      takeUntilDestroyed(),
    )
    .subscribe();

  public readonly recorderReadyEffect = effect(() => {
    if (this.screenRecorderFacadeService.isReady()) {
      this.recorderReadyEffect.destroy();
      this.screenRecorderFacadeService.start();
    }
  });

  private readonly screenRecorderInitializationEffect = effect(() => {
    const screenRecorder = this.takeExamRecording()?.screenRecorder();

    if (!screenRecorder || this.examinationDurationInSeconds() <= 0) {
      return;
    }

    const playerRecorder = videojs(
      screenRecorder?.nativeElement as HTMLVideoElement,
      {
        controls: true,
        plugins: {
          record: {
            audio: true,
            video: false,
            screen: true,
            maxLength: this.examinationDurationInSeconds(),
            mediaRecorderOptions: {
              mimeType: 'video/webm;codecs=vp8,opus',
            },
          },
        },
      },
      () => {
        console.log(
          'player ready! id:',
          this.takeExamRecording()?.screenRecorder().nativeElement.id,
        );

        // print version information at startup
        const msg =
          'Using video.js ' +
          //videojs.VERSION +
          ' with videojs-record ' +
          videojs.getPluginVersion('record') +
          ' and recordrtc ' +
          RecordRTC.version;
        videojs.log(msg);
      },
    ) as VideoJsPlayerWithRecord;

    this.screenRecorderFacadeService.init(playerRecorder, true);
    this.screenRecorderInitializationEffect.destroy();
  });

  public readonly screenRecordingToPauseCountdownTimerEffect = effect(() => {
    const timeRemaining = this.recordingToPauseCountdownTimer.timeRemaining;
    console.log('Time Remaining to pause Recording', timeRemaining);
    if (!this.appConfig.allowRecording) {
      this.screenRecordingToPauseCountdownTimerEffect.destroy();
      return;
    }

    if (timeRemaining <= 0) {
      const isTabActive = untracked(() => this.tabActive());

      if (isTabActive) {
        // pause the recording
        this.screenRecorderFacadeService.pause();
      }

      this.recordingToPauseCountdownTimer.reset(this.appConfig.recordingToPauseTimeInSeconds);
    }
  });

  ngOnInit(): void {
    this.inActiveTabCountdownTimer.start(this.appConfig.inactiveTimeInSeconds);
    this.inActiveTabCountdownTimer.pause();
    this.recordingToPauseCountdownTimer.start(this.appConfig.recordingToPauseTimeInSeconds);
    this.recordingToPauseCountdownTimer.pause();
  }

  private onTabHidden(): void {
    console.log('start exit timer');

    this.hasInactiveStatus = true;

    this.inActiveTabCountdownTimer.resume();
  }

  private onTabVisible(): void {
    console.log('stop exit timer');
    this.inActiveTabCountdownTimer.pause();
    this.recordingToPauseCountdownTimer.resume();
    if (this.timeLeft > 0 && this.modal.openModals.length <= 0) {
      this.notificationService.warning(
        'Examination Time Limit',
        `You only have ${toTimeFormatFromSeconds(this.inActiveTabCountdownTimer.timeRemaining, false)} seconds to be inactive. Examination will exit automatically after limit has reach!`,
      );
    }
  }

  public takeExaminationStateEffect = effect(() => {
    if (this.takeExamState() === this.TakeExamStateEnum.takeExamQuestionView) {
      this.examinationDurationCountdownTimer.start(this.examinationDurationInSeconds());
      this.takeExaminationStateEffect.destroy();
    }
  });

  public recordingStateEffect = effect(() => {
    console.log(this.screenRecorderFacadeService.state());
    console.log('is Record', this.screenRecorderFacadeService.isRecording());
  });

  private readonly inActiveTabCountdownTimerEffect = effect(() => {
    console.log(this.inActiveTabCountdownTimer.timeRemaining);

    if (this.inActiveTabCountdownTimer.timeRemaining <= 0) {
      this.onFinishExamination();
    }
  });

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
        this.examDetail.set(exam);
        this.examinationDurationInSeconds.set(toSeconds(exam.duration, 'min'));
      }),

      switchMap(() => this.takeExamService.getExamTakerByExamId(this.examId)),

      tap((record) => {
        if (record && !this.appConfig.fetchPreviousExam) {
          throw new Error('EXAM_ALREADY_FINISHED');
        }

        this.examTaker.set(record);
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

  private onCompleteTimer(): void {
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
      nzContent: this.appConfig.fetchPreviousExam
        ? 'Do you want to continue'
        : `Starting the examination will record your screen. Do you want to continue?`,
      nzOnOk: () => {
        this.startExamAndLoadQuestion();
      },
    });
  }

  private loadCurrentQuestion(attemptId: number) {
    return this.takeExamService.getCurrentQuestion(attemptId);
  }

  private startExamAndLoadQuestion(): void {
    if (this.appConfig.fetchPreviousExam) {
      this.loadCurrentQuestion(this.examTakerId)
        .pipe(
          tap((question) => {
            if (!question) {
              throw new Error('NO_CURRENT_QUESTION');
            }

            this.currentQuestion.set(question);
            this.onStartExam();
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

      return;
    }

    this.takeExamService
      .addExamTaker(this.examId)
      .pipe(
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
    this.cameraVisible = this.appConfig.allowRecording;
    this.videoVisible.set(this.appConfig.allowRecording);
    this.takeExamState.set(ExamState.takeExamQuestionView);
  }

  private get examTakerId(): number {
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

          return this.loadCurrentQuestion(this.examTakerId);
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

  onBack() {
    this.location.back();
  }

  public onFinishExamination(): void {
    if (this.screenRecorderFacadeService.isRecording()) {
      this.screenRecorderFacadeService.stop();
      return;
    }

    this.goToResults();
  }

  public readonly finishExaminationWithScreenRecordingEffect = effect(() => {
    if (this.screenRecorderFacadeService.state() !== 'finished') {
      return;
    }

    console.log('Blob', this.screenRecorderFacadeService.recordedBlob());

    const sessionId = crypto.randomUUID();

    this.uploadService
      .uploadFile(
        this.screenRecorderFacadeService.recordedBlob() as Blob,
        'recording.webm',
        sessionId,
      )
      .pipe(
        switchMap(() => this.uploadService.finalizeUpload(sessionId, 'recording.webm')),
        tap(() => {
          this.goToResults();
        }),

        catchError(() => {
          return EMPTY;
        }),
      )
      .subscribe();

    this.finishExaminationWithScreenRecordingEffect.destroy();
  });

  onUploadRecord(data: any) {
    // if (this.hasInactiveStatus) {
    //   this.takeExamService.upload(data).subscribe({
    //     next: (value) =>
    //       this.takeExamService.get(this.examTaker()?.id ?? 0).subscribe((val) =>
    //         this.takeExamService
    //           .updateTakerExam(this.examTaker()?.id ?? 0, {
    //             ...val,
    //             recUrl: `${this.appConfig.uploadUrl}/uploads/${data.name}`,
    //           })
    //           .subscribe((val) => {
    //             this.goToResults();
    //           }),
    //       ),
    //     error: (err) => console.log(err),
    //   });
    // } else {
    //   this.goToResults();
    // }
  }
  private goToResults() {
    this.router.navigate([`exams/${this.examId}/result`]);
  }

  private goToDashBoard() {
    this.router.navigate([`dashboard`]);
  }
}
