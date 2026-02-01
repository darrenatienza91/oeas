import { Component, inject, OnInit } from '@angular/core';
import * as fromAuth from '@batstateu/auth';
import { AuthPayload } from '@batstateu/data-models';
import { Observable } from 'rxjs';
import { AuthService } from '@batstateu/auth';
import { Store } from '@ngrx/store';
import { LayoutViewComponent } from '../../components/layout-view/layout-view.component';

@Component({
  imports: [LayoutViewComponent],
  selector: 'batstateu-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
})
export class LayoutComponent implements OnInit {
  user$!: Observable<AuthPayload | null>;
  isCollapsed = false;
  private store = inject(Store<fromAuth.State>);
  private authService = inject(AuthService);

  public onCollapsed(isCollapsed: boolean): void {
    this.isCollapsed = isCollapsed;
  }

  ngOnInit(): void {
    this.user$ = this.store.select(fromAuth.getAuthSuccess);
  }

  public onLogout(): void {
    this.authService.logout();
  }
}
