import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { authRoutes, AuthModule, AuthGuard } from '@batstateu/auth';
import { LayoutModule } from '@batstateu/layout';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { APP_CONFIG } from '@batstateu/app-config';
import { ExamGuard } from '@batstateu/shared';
import { LayoutComponent } from 'libs/layout/src/lib/containers/layout/layout.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    LayoutComponent,
    BrowserModule,
    RouterModule.forRoot(
      [
        { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
        { path: 'auth', children: authRoutes },
        {
          path: 'dashboard',
          loadChildren: () =>
            import('@batstateu/dashboard').then(
              (module) => module.DashboardModule
            ),
          canActivate: [AuthGuard],
        },
        {
          path: 'setting',
          loadChildren: () =>
            import('@batstateu/setting').then((module) => module.SettingModule),
          canActivate: [AuthGuard],
        },
        {
          path: 'exams',
          loadChildren: () =>
            import('@batstateu/exams').then((module) => module.ExamsModule),
          canActivate: [AuthGuard],
          canActivateChild: [ExamGuard],
        },
        {
          path: 'account',
          loadChildren: () =>
            import('@batstateu/account').then((module) => module.AccountModule),
          canActivate: [AuthGuard],
        },
      ],
      {
        initialNavigation: 'enabledBlocking',
      }
    ),
    AuthModule,
    LayoutModule,
    StoreModule.forRoot(
      {},
      {
        metaReducers: !environment.production ? [] : [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }
    ),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument({ connectInZone: true }) : [],
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [{ provide: APP_CONFIG, useValue: environment }, ExamGuard],
  bootstrap: [AppComponent],
})
export class AppModule { }
