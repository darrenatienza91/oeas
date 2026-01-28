import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Location } from '@angular/common';
import { QuestionDetail } from '@batstateu/data-models';
import { Editor, Toolbar } from 'ngx-editor';
import { ExamsModule } from '@batstateu/exams';
@Component({
  imports: [ExamsModule],
  selector: 'batstateu-question-form-view',
  templateUrl: './question-form-view.component.html',
  styleUrls: ['./question-form-view.component.less']
})
export class QuestionFormViewComponent implements OnInit, OnChanges, OnDestroy {
  editor!: Editor;
  editorAns!: Editor;
  @Output() save = new EventEmitter<QuestionDetail>();
  @Input() questionDetail!: QuestionDetail;
  validateForm!: UntypedFormGroup;
  title = "Add New";
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
  setValue() {
    this.validateForm.patchValue(this.questionDetail);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questionDetail']) {
      if (this.questionDetail) {
        this.setValue();
        this.title = "Edit"
      }
    }
  }
  cancel() {
    this.location.back();
  }

  constructor(
    private fb: UntypedFormBuilder,
    private modal: NzModalService,
    private location: Location
  ) { }
  ngOnDestroy(): void {
    this.editor.destroy();
    this.editorAns.destroy();
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.editorAns = new Editor();
    this.validateForm = this.fb.group({
      question: [null, [Validators.required]],
      correctAnswer: [null, [Validators.required]],
      maxpoints: [60, [Validators.required]],
    });
  }

}
