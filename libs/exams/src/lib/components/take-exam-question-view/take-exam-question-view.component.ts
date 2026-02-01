import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TakerExamQuestion } from '@batstateu/data-models';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { Observable } from 'rxjs';
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
})
export class TakeExamQuestionViewComponent implements OnInit {
  @Input() currentQuestion!: TakerExamQuestion;
  @Input() question = '';
  @Input() currentQuestion$!: Observable<TakerExamQuestion | null>;
  @Output() save = new EventEmitter();
  @Input() videoVisible$!: Observable<boolean>;
  @Input() tabActive$!: Observable<boolean | null>;
  limit = 60;
  validateForm!: UntypedFormGroup;
  editor!: Editor;

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
  setQuestion() {
    this.currentQuestion$.subscribe((val) => {
      if (val) {
        this.question = val.question;
        this.validateForm.patchValue({ answer: '' });
      }
    });
  }
  constructor(
    private fb: UntypedFormBuilder,
    private modal: NzModalService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.editor = new Editor();
    this.validateForm = this.fb.group({
      answer: [null, [Validators.required]],
    });
    this.setQuestion();
  }
}
