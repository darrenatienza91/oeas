import { CommonModule, Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Exam, Section } from '@batstateu/data-models';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { toolbar as toolbars } from './utils';

@Component({
  imports: [NgxEditorModule, ReactiveFormsModule, FormsModule, NgZorroAntdModule, CommonModule],
  selector: 'batstateu-exam-form-view',
  templateUrl: './exam-form-view.component.html',
  styleUrls: ['./exam-form-view.component.less'],
})
export class ExamFormViewComponent implements OnInit, OnDestroy {
  editor!: Editor;
  html!: '';
  @Output() save = new EventEmitter<Exam>();
  public sections = input<Section[]>();
  @Input() examDetail!: Exam;
  validateForm!: UntypedFormGroup;
  title = 'Add New';
  public toolBars = toolbars;

  private fb: UntypedFormBuilder = inject(UntypedFormBuilder);
  private location: Location = inject(Location);

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
  onBack() {
    this.location.back();
  }

  setValue() {
    this.validateForm.patchValue({
      ...this.examDetail,
      startOn: new Date(this.examDetail.startOn),
    });
  }

  durationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value <= 0) {
      return { confirm: true, error: true };
    }
    return {};
  };

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  ngOnInit(): void {
    this.editor = new Editor();
    if (this.examDetail?.id) {
      this.title = 'Edit';
    }
    this.validateForm = this.fb.group({
      name: [this.examDetail.name, [Validators.required]],
      subject: [this.examDetail.subject, [Validators.required]],
      startOn: [
        this.examDetail.startOn ? new Date(this.examDetail.startOn) : new Date(),
        [Validators.required],
      ],
      duration: [this.examDetail?.duration ?? 60, [Validators.required, this.durationValidator]],
      sectionId: [this.examDetail.sectionId, [Validators.required]],
      instructions: [this.examDetail.instructions, [Validators.required]],
    });
  }
}
