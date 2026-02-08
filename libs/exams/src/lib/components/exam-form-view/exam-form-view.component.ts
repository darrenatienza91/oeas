import { CommonModule, Location } from '@angular/common';
import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  input,
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
  private fb: UntypedFormBuilder = inject(UntypedFormBuilder);
  private location: Location = inject(Location);
  editor!: Editor;
  html!: '';
  private durationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value <= 0) {
      return { confirm: true, error: true };
    }
    return {};
  };

  @Output() save = new EventEmitter<Exam>();
  public sections = input<Section[]>();
  public examDetail = input<Exam | null>(null);
  public validateForm: UntypedFormGroup = this.fb.group({
    name: ['', [Validators.required]],
    subject: ['', [Validators.required]],
    startOn: [new Date(), [Validators.required]],
    duration: [60, [Validators.required, this.durationValidator]],
    sectionId: [null, [Validators.required]],
    instructions: ['', [Validators.required]],
  });

  public title = computed(() => {
    return !this.examDetail()?.id ? 'Add New' : 'Edit';
  });

  public toolBars = toolbars;

  constructor() {
    this.editor = new Editor();
    effect(() => {
      if (!this.examDetail()?.id) {
        return;
      }

      this.validateForm.patchValue({
        ...this.examDetail(),
        startOn: new Date(this.examDetail()?.startOn as string),
      });
    });
  }

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

  setValue() {}

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  ngOnInit(): void {}
}
