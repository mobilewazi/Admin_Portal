import { InjectionToken } from '@angular/core';
import { EnvironmentInterface } from './environment.interface';
export const userStorageKey = 'auth-user';
export const userTokenStorageKey = 'auth-user-token';

export const ENVIRONMENT = new InjectionToken<EnvironmentInterface>('')

