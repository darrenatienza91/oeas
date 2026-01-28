import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder, UntypedFormGroup,
  Validators
} from '@angular/forms';
import {
  Department,
  Section,
  UserDetail,
  UserFormLocation,
  UserFormType,
  UserType,
} from '@batstateu/data-models';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  imports: [NgZorroAntdModule, ReactiveFormsModule],
  selector: 'batstateu-user-form-view',
  templateUrl: './user-form-view.component.html',
  styleUrls: ['./user-form-view.component.css'],
})
export class UserFormViewComponent implements OnInit, OnChanges, DoCheck {
  @Output() save = new EventEmitter<UserDetail>();
  @Input() userDetail!: UserDetail;
  @Input() isActiveEnable = false;
  validateForm!: UntypedFormGroup;
  @Input() departments!: Department[];
  @Input() sections!: Section[];
  @Input() userFormType!: UserFormType;
  @Input() userTypes!: UserType[];
  @Input() code!: string;
  @Input() userFormLocation!: UserFormLocation;
  @Input() isHideUserTypeList!: boolean;
  @Input() isSetting!: boolean;

  UserFormTypeEnum = UserFormType;
  UserFormLocationEnum = UserFormLocation;

  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone',
  };

  setValue() {
    this.validateForm.patchValue(this.userDetail);
    if (this.isActiveEnable) {
      this.validateForm.controls['isActive'].enable();
    }
  }
  submitForm(): void {
    if (this.validateForm.valid) {
      const userDetail: UserDetail = { ...this.validateForm.value };
      this.save.emit(userDetail);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  onChange(val: number) {
    this.userFormType = val === 3 ? this.UserFormTypeEnum.STUDENT : this.UserFormTypeEnum.FACULTY_ADMIN;
    if (this.userFormType === this.UserFormTypeEnum.STUDENT) {
      this.setSectionValidator();
    }
  }
  constructor(private fb: UntypedFormBuilder, private modal: NzModalService) { }

  ngDoCheck(): void {
    this.validateForm.controls['code'].setValue(this.code);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userDetail']) {
      if (this.userDetail != undefined) {
        this.setValue();
        this.setSectionValidator();
      }
    }
  }
  setSectionValidator() {
    if (this.userFormType === UserFormType.FACULTY_ADMIN) {
      this.validateForm.controls['sectionId'].clearValidators();
      this.validateForm.controls['sectionId'].updateValueAndValidity();
    } else {
      this.validateForm.controls['sectionId'].addValidators(Validators.required);
      this.validateForm.controls['sectionId'].updateValueAndValidity();
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      code: [{ value: null, disabled: true }],
      email: [null, [Validators.email, Validators.required]],
      firstName: [null, [Validators.required]],
      middleName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      address: [null, [Validators.required]],
      contactNumberPrefix: ['+63'],
      contactNumber: [null, [Validators.required]],
      departmentId: [null, [Validators.required]],
      sectionId: [null],
      isActive: [{ value: false, disabled: true }],
      userTypeId: [null, [Validators.required]],
    });
  }
}
