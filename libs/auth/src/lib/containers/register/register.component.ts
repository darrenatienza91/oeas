import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from '../../services/auth/auth.service';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';

@Component({
  imports: [RegisterFormComponent],
  selector: 'batstateu-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
  onRegister(reg: any) {
    this.authService.register(reg).subscribe({
      next: () => this.showSuccessMessage(),
      error: (e) => this.showErrorMessage(e.error.message),
    });
  }
  showSuccessMessage() {
    this.modal.success({
      nzTitle: 'Success Registration',
      nzContent:
        'Your Sr code will be your user name. <br/> Please wait for your account activation.',
      nzOnOk: () => {
        this.router.navigate(['/auth/login']);
      },
    });
  }
  showErrorMessage(message: string) {
    this.modal.error({
      nzTitle: 'Error Registration',
      nzContent: message,
    });
  }
  constructor(
    private modal: NzModalService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void { }
}
