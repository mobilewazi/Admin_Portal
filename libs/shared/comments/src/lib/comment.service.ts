import { Injectable, signal } from '@angular/core';
import { IComment } from './comment.interface';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CommentService {

  comments = signal<IComment[]>([]);
  comments$: Observable<IComment[]> = toObservable(this.comments)
  getAll(value: any, by = 'id') {
    return this.comments$
  }
  create(value: any) {

    const comment = {
      id: Math.random(),
      createdAt: new Date().toISOString(),
      description: value['newComment']
    };
    this.comments.set([
      comment,
      ...this.comments(),
    ]);

    return of(comment as IComment)
  }
}
