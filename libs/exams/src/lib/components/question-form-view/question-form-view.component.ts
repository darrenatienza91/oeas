import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { QuestionDetail } from '@batstateu/data-models';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { RouterLink } from '@angular/router';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
@Component({
  imports: [
    NgxEditorModule,
    ReactiveFormsModule,
    FormsModule,
    NgZorroAntdModule,
    RouterLink,
    CommonModule,
  ],
  selector: 'batstateu-question-form-view',
  templateUrl: './question-form-view.component.html',
  styleUrls: ['./question-form-view.component.less'],
})
export class QuestionFormViewComponent implements OnInit, OnDestroy {
  editor!: Editor;
  editorAns!: Editor;
  @Output() save = new EventEmitter<QuestionDetail>();
  @Input() questionDetail!: QuestionDetail;
  validateForm!: UntypedFormGroup;
  title = 'Add New';
  toolbar: Toolbar = [
    // default value
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  submitForm(): void {
    if (this.validateForm.valid) {
      this.save.emit(this.validateForm.value);
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

  constructor(
    private fb: UntypedFormBuilder,
    private location: Location,
  ) {}
  ngOnDestroy(): void {
    this.editor.destroy();
    this.editorAns.destroy();
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.editorAns = new Editor();
    this.validateForm = this.fb.group({
      description: [this.questionDetail.description, [Validators.required]],
      correctAnswer: [this.questionDetail.correctAnswer, [Validators.required]],
      points: [this.questionDetail.points ?? 60, [Validators.required]],
    });
  }
}
