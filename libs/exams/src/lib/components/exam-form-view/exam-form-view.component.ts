import { Location } from '@angular/common';
import {
  Component, EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Exam, Section } from '@batstateu/data-models';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Editor, Toolbar } from 'ngx-editor';
import { ExamsModule } from '../../exams.module';

@Component({
  imports: [ExamsModule],
  selector: 'batstateu-exam-form-view',
  templateUrl: './exam-form-view.component.html',
  styleUrls: ['./exam-form-view.component.less'],
})
export class ExamFormViewComponent implements OnInit, OnChanges, OnDestroy {
  editor!: Editor;
  html!: '';
  @Output() save = new EventEmitter<Exam>();
  @Input() sections!: Section[];
  @Input() examDetail!: Exam;
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
  onBack() {
    this.location.back();
  }
  setValue() {
    this.validateForm.patchValue({ ...this.examDetail, startOn: new Date(this.examDetail.startOn) });
  }
  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.validateForm.controls['checkPassword'].updateValueAndValidity()
    );
  }

  durationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value <= 0) {
      return { confirm: true, error: true };
    }
    return {};
  };

  constructor(private fb: UntypedFormBuilder, private modal: NzModalService, private location: Location) { }
  ngOnDestroy(): void {
    this.editor.destroy();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['examDetail']) {
      if (this.examDetail) {
        this.setValue();
        this.title = 'Edit';
      }
    }
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      subject: [null, [Validators.required]],
      startOn: [new Date(), [Validators.required]],
      duration: [60, [Validators.required, this.durationValidator]],
      sectionId: [null, [Validators.required]],
      instructions: [null, [Validators.required]],
    });
  }
}
