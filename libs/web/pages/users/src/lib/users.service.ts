import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ICreatedProject, IProject, ProjectInterface, ResponseInterface } from '@mwazi/shared/data-models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) {
  }

  getAll(): Observable<ProjectInterface[]> {
    return this.http.get<ResponseInterface<ProjectInterface[]>>('dashboard/users').pipe(
      map(({responseObject}) => responseObject),
    )
  }

    getById(userId: string): Observable<ProjectInterface[]> {
    return this.http.get<ResponseInterface<ProjectInterface[]>>(`users/${userId}`).pipe(
      map(({responseObject}) => responseObject),
    )
  }

  create(value: any) {
    return this.http.post<ResponseInterface<ICreatedProject>>('api/users', value).pipe(
      map(({responseObject}) => responseObject),
    )
  }

  update({data, projectId}: { projectId: number, data: any }) {
    console.log(projectId, data)
    return this.http.patch<ResponseInterface<ICreatedProject>>(`api/users/${projectId}`,  data).pipe(
      map(({responseObject}) => responseObject),
    )
  }

  getItemBy(value: any, by = 'id') {
    return this.http.get<ResponseInterface<IProject>>(`api/users/${value}`).pipe(
      map(({responseObject}) => responseObject),
    )
  }

  activate({projectId, deactivateProject}: { projectId: number, deactivateProject: boolean }) {
    return this.http.patch<ResponseInterface<IProject>>(`api/users/${projectId}`, {
      deactivateProject
    });
  }
}
