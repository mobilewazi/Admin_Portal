import { Component, Input, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { IconListEnum, IconService } from '@mwazi/shared/icons';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { CommentService } from '@mwazi/shared/comments';
import { tap } from 'rxjs';

interface IComment {
  id: number,
  description: string,
  createdAt: string
}

@Component({
  selector: 'mwazi-transaction-comments',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: 'transaction-comments.component.html',
  styleUrls: ['transaction-comments.component.scss']
})

export class TransactionCommentsComponent {
  @ViewChild(FormGroupDirective) formDirective?: FormGroupDirective;
  @Input({ required: true })
  set transactionComments(value: IComment[]) {
    this.comments.set(value)
  }

  comments = signal<IComment[]>([]);
  form = this.fb.group({
    newComment: ['', [Validators.required]]
  })

  constructor(
    private fb: FormBuilder, iconService: IconService,
    private commentService: CommentService
    ) {
    iconService.registerIcons([IconListEnum.Submit]);
  }

  addComment(event: any) {
    event.stopPropagation();

    this.commentService.create(this.form.value).pipe(
      tap((res) => {
        this.comments.set([
          ...this.comments(),
          res
        ]);
      })
    ).subscribe()
    this.form.reset();
    this.formDirective?.resetForm()
  }
}
