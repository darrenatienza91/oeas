import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AUTH_FEATURE_KEY, State } from './auth.reducer';

// Lookup the 'Auth' feature state managed by NgRx
export const getAuthState = createFeatureSelector<State>(AUTH_FEATURE_KEY);

export const getAuthLoading = createSelector(getAuthState, (state: State) => state.loading);

export const getAuthError = createSelector(getAuthState, (state: State) => state.error);

export const getAuthSuccess = createSelector(getAuthState, (state: State) => state.authPayload);
