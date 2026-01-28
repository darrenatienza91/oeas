import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { LoginComponent } from './containers/login/login.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgZorroAntdModule } from '@batstateu/ng-zorro-antd';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './interceptors/auth/auth.interceptor';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromAuth from './+state/auth.reducer';
import { AuthEffects } from './+state/auth.effects';
import { LocalStorageService } from './services/local-storage.service';
import { storageMetaReducer } from './storage-metareducer';
import {
  AUTH_CONFIG_TOKEN,
  AUTH_LOCAL_STORAGE_KEY,
  AUTH_STORAGE_KEYS,
} from './auth.tokens';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { RegisterComponent } from './containers/register/register.component';
import { ForgotPasswordComponent } from './containers/forgot-password/forgot-password.component';
import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password-form.component';

export function getAuthConfig(
  saveKeys: string[],
  localStorageKey: string,
  storageService: LocalStorageService
) {
  return {
    metaReducers: [
      storageMetaReducer(saveKeys, localStorageKey, storageService),
    ],
  };
}

export const authRoutes: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
];
const COMPONENTS = [
  LoginComponent,
  LoginFormComponent,
  RegisterComponent,
  RegisterFormComponent,
  ForgotPasswordComponent,
  ForgotPasswordFormComponent,
];
@NgModule({
  imports: [
    COMPONENTS,
    CommonModule,
    RouterModule,
    HttpClientModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    StoreModule.forFeature(
      fromAuth.AUTH_FEATURE_KEY,
      fromAuth.reducer,
      AUTH_CONFIG_TOKEN
    ),
    EffectsModule.forFeature([AuthEffects]),
  ],
  exports: [COMPONENTS],
  providers: [
    { provide: AUTH_LOCAL_STORAGE_KEY, useValue: '__auth_storage__' },
    { provide: AUTH_STORAGE_KEYS, useValue: ['user'] },
    {
      provide: AUTH_CONFIG_TOKEN,
      deps: [AUTH_STORAGE_KEYS, AUTH_LOCAL_STORAGE_KEY, LocalStorageService],
      useFactory: getAuthConfig,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class AuthModule { }
