import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  input,
  OnDestroy,
  OnInit,
  Output,
  Signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { QuestionDetail } from '@batstateu/data-models';
import { Editor, NgxEditorModule, Toolbar, TOOLBAR_MINIMAL } from 'ngx-editor';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionFormViewComponent implements OnInit, OnDestroy {
  private fb = inject(UntypedFormBuilder);
  private location = inject(Location);

  editor!: Editor;
  editorAns!: Editor;
  @Output() save = new EventEmitter<QuestionDetail>();
  public questionDetail = input<QuestionDetail>();
  public title: Signal<'Edit' | 'Add New'> = computed(() =>
    this.questionDetail()?.id ? 'Edit' : 'Add New',
  );
  toolbar: Toolbar = TOOLBAR_MINIMAL;

  public validateForm = this.fb.group({
    description: ['', [Validators.required]],
    correctAnswer: ['', [Validators.required]],
    points: [1, [Validators.required]],
  });

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

  constructor() {
    this.editor = new Editor();
    this.editorAns = new Editor();
  }
  ngOnDestroy(): void {
    this.editor.destroy();
    this.editorAns.destroy();
  }

  private x = effect((y) => {
    if (!this.questionDetail()?.id) {
      return;
    }
    this.validateForm.patchValue({
      description: this.questionDetail()?.description,
      correctAnswer: this.questionDetail()?.correctAnswer,
      points: this.questionDetail()?.points,
    });
  });

  ngOnInit(): void {}
}
