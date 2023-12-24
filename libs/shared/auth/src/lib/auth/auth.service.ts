import { Injectable, signal } from '@angular/core';
import { SocialUser } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { userStorageKey, userTokenStorageKey } from './constants';
import { EMPTY, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = signal(false);
  user = signal<SocialUser>({
    provider: '',
    id: '',
    email: '',
    name: '',
    photoUrl: '',
    firstName: '',
    lastName: '',
    authToken: '',
    idToken: '',
    authorizationCode: '',
    response: undefined
  });

  authDetails = signal({
    accessToken: '',
    refreshToken: ''
  })

  constructor(private router: Router, private http: HttpClient) {
    const savedUser = sessionStorage.getItem(userStorageKey);
    const savedToken = sessionStorage.getItem(userTokenStorageKey);
    if (savedUser && savedToken) {
      const user = JSON.parse(savedUser) as SocialUser;
      this.user.set(user);
      this.loggedIn.set(true);
      const userToken = JSON.parse(savedToken) as {
        accessToken: string,
        refreshToken: string
      };
      this.authDetails.set(userToken);
      this.loggedIn.set(true);
    }
  }

  authenticate(user: SocialUser) {
    if (user) {
      return this.http.post<{ ['access_token']: string; ['refresh_token']: string; }>('auth/authenticate', {
        accessToken: user.idToken,
        source: 'google'
      }).pipe(
        tap((authDetails) => {
          console.log(authDetails)
          this.authDetails.set({
            accessToken: authDetails['access_token'],
            refreshToken: authDetails['refresh_token']
          })
          sessionStorage.setItem(userStorageKey, JSON.stringify(user))
          sessionStorage.setItem(userTokenStorageKey, JSON.stringify(this.authDetails()))
          this.user.set(user);
          this.loggedIn.set(true);
          this.router.navigate(['/dashboard'])
        })
      )
    }
    return EMPTY
  }
}
