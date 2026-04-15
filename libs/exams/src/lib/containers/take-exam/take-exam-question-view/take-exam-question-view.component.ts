import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { ExamAttemptQuestion } from '@batstateu/data-models';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { TakeExamCameraViewComponent } from '../take-exam-camera-view/take-exam-camera-view.component';

@Component({
  imports: [
    NgxEditorModule,
    TakeExamCameraViewComponent,
    ReactiveFormsModule,
    FormsModule,
    NgZorroAntdModule,
    CommonModule,
  ],
  selector: 'batstateu-take-exam-question-view',
  templateUrl: './take-exam-question-view.component.html',
  styleUrls: ['./take-exam-question-view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TakeExamQuestionViewComponent {
  private readonly fb: UntypedFormBuilder = inject(UntypedFormBuilder);
  private readonly modal: NzModalService = inject(NzModalService);
  private readonly location: Location = inject(Location);

  public currentQuestion = input<ExamAttemptQuestion | null>(null);
  @Output() save = new EventEmitter();
  public videoVisible = input(true);
  limit = 60;
  public editor!: Editor;

  public validateForm = this.fb.group({
    answer: ['x', [Validators.required]],
  });

  constructor() {
    this.editor = new Editor();
  }

  private readonly _ = effect(() => {
    if (this.currentQuestion()) {
      this.validateForm.patchValue({
        answer: this.currentQuestion()?.examAttemptAnswerText || '<p></p>',
      });
    }
  });

  public questionSpan = computed(() => (this.videoVisible() ? 16 : 24));
  toolbar: Toolbar = [
    // default value
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  confirmationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
      //TODO: set limit for points
    } else if (control.value > this.limit) {
      return { confirm: true, error: true };
    }
    return {};
  };

  submitForm(): void {
    if (this.validateForm.valid) {
      this.modal.confirm({
        nzTitle: 'Submit Answer',
        nzContent: `Are you sure you want to submit answer? <br/> Submitted answer can't be reverted.`,
        nzOnOk: () => {
          const answer = this.validateForm.controls['answer'].value;
          this.save.emit(answer);
        },
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  cancel() {
    this.location.back();
  }
}
