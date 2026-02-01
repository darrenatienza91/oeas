import { createAction, props } from '@ngrx/store';
import { Authenticate, AuthPayload } from '@batstateu/data-models';

export enum AuthActionTypes {
  Login = '[Auth Page] Login',
  LoginSuccess = '[Auth API] Login Success',
  LoginSuccessNewAccount = '[Auth API] Login Success New Account',
  LoginFail = '[Auth API] Login Fail',
  Logout = '[Auth Page] Logout',
  LoadCachedUser = '',
}

export const login = createAction(AuthActionTypes.Login, props<{ payload: Authenticate }>());

export const loginSuccess = createAction(
  AuthActionTypes.LoginSuccess,
  props<{ payload: AuthPayload }>(),
);

export const loginSuccessNewAccount = createAction(
  AuthActionTypes.LoginSuccessNewAccount,
  props<{ payload: AuthPayload }>(),
);

export const loginFailure = createAction(AuthActionTypes.LoginFail, props<{ payload: any }>());

export const logout = createAction(AuthActionTypes.Logout);

export type AuthActions =
  | typeof login
  | typeof loginSuccess
  | typeof loginFailure
  | typeof logout
  | typeof loginSuccessNewAccount;
