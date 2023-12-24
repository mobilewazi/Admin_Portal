import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ResponseInterface } from '@mwazi/shared/data-models';
import { IProfileUser } from './profile.interface';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {
  constructor(private http: HttpClient) {
  }
  getProfile () {
    return this.http.get<ResponseInterface<IProfileUser>>('profile').pipe(
      map(({responseObject}) => responseObject)
    );
  }
}
