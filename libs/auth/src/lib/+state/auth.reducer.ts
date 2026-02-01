import { createReducer, on, Action } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthPayload } from '@batstateu/data-models';
export const AUTH_FEATURE_KEY = 'auth';

export interface State {
  loading: boolean;
  authPayload: AuthPayload | null;
  error: '';
}

export const initialState: State = {
  error: '',
  authPayload: null,
  loading: false,
};
//feature selector on index.ts
const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state, action) => ({ ...state, auth: action.payload, loading: true })),
  on(AuthActions.loginSuccess, (state, action) => {
    return {
      ...state,
      authPayload: action.payload,
      loading: false,
    };
  }),
  on(AuthActions.loginSuccessNewAccount, (state, action) => ({
    ...state,
    authPayload: action.payload,
    loading: false,
  })),
  on(AuthActions.loginFailure, (state) => ({
    ...state,
    authPayload: null,
    loading: false,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    authPayload: null,
    loading: false,
  })),
);

export function reducer(state: State | undefined, action: Action) {
  return authReducer(state, action);
}
