import { ApplicationConfig, importProvidersFrom, inject } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation,withHashLocation } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthService, ENVIRONMENT, EnvironmentInterface } from '@mwazi/auth';
import { MatNativeDateModule } from '@angular/material/core';
import { provideCacheableAnimationLoader, provideLottieOptions } from 'ngx-lottie';
import { addHttpLoader } from '@mwazi/shared/loading';
import { handleHttpError } from '@mwazi/shared/alert';

const addBaseUrl = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const fileExtensionRegex = /\.(jpg|png|pdf|json|svg)$/i;
  const env = inject(ENVIRONMENT);
  let apiReq = req;
  if (!fileExtensionRegex.test(req.url)) {
    apiReq = req.clone({url: `${env.baseHref}/${req.url}`});
  }
  return next(apiReq)
};

const addAccessToken = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authToken = inject(AuthService).authDetails().accessToken;
  let apiReq = req;

  if (authToken.length > 0) {
    apiReq = req.clone(
      {
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      });
  }
  return next(apiReq)
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation(), withHashLocation()),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        addBaseUrl,
        addAccessToken,
        addHttpLoader,
        handleHttpError
      ])
    ),
    provideLottieOptions({
      player: () => import(/* webpackChunkName: 'lottie-web' */ 'lottie-web'),
    }),
    provideCacheableAnimationLoader(),
    importProvidersFrom([
      MatNativeDateModule
    ]),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        // autoLogin: true,
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              process.env['NX_GOOGLE_PROVIDER_CLIENT_ID'] ?? ''
            )
          }
        ],
        onError: (err: any) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    {
      provide: ENVIRONMENT,
      useValue: {
        baseHref: process.env['NX_BASE_HREF']
      } as EnvironmentInterface
    }
  ],
};
