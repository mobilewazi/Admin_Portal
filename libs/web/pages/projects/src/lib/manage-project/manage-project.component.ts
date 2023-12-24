import { Component, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { NgForOf, NgIf } from '@angular/common';
import { ProjectService } from '@mzima/shared/projects';
import { filter, Observable, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ICreatedProject, IProject } from '@mwazi/shared/data-models';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { SuccessDialogComponent } from '@mwazi/shared/alert';

@Component({
  standalone: true,
  templateUrl: 'manage-project.component.html',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatButtonModule,
    NgIf,
    MatSelectModule,
    NgForOf,
    MatIconModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent
  ],
  styleUrls: ['manage-project.component.scss']
})

export class ManageProjectComponent {
  @ViewChild('successDialogContents') private successDialogContents?: TemplateRef<any>;
  @ViewChild('successDialogActions') private successDialogActions?: TemplateRef<any>;
  projectId = signal<number | null>(null);
  categories = signal([
    {label: 'Party', id: 'Party'},
    {label: 'Wedding', id: 'Wedding'},
    {label: 'Baby Shower', id: 'Baby Shower'},
    {label: 'Medical', id: 'Medical'},
    {label: 'Funeral', id: 'Funeral'},
    {label: 'Other', id: 'Other'},
  ])
  showOtherCategory = signal(false);
  form = this.fb.group({
    projectName: ['', [Validators.required]],
    category: ['', [Validators.required]],
    targetAmount: ['' as any],
    startDate: ['', [Validators.required]],
    endDate: [null as string | null],
    deactivateOnTargetAmountReached: [true, [Validators.required]],
    deactivateOnEndDateReached: [true, [Validators.required]],
    deactivateWhenExpenseExceedCollection: [true, [Validators.required]],
    description: [''],
    otherCategory: [''],
  })

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private dialog: MatDialog,
    route: ActivatedRoute
  ) {
    this.form.get('category')?.valueChanges.pipe(
      tap((res) => {
        this.showOtherCategory.set(res === 'Other');
        if (res === 'Other') {
          this.form.get('otherCategory')?.addValidators([Validators.required]);
        } else {
          this.form.get('otherCategory')?.removeValidators([Validators.required])
        }
        this.form.get('otherCategory')?.updateValueAndValidity();
        this.form.updateValueAndValidity();
      }),
      takeUntilDestroyed()
    ).subscribe();

    route.data.pipe(
      tap((res) => {
        const project = res['project'] as IProject;
        if (project) {
          this.form.patchValue(project);
          this.projectId.set(project.id)
        }
      }),
      takeUntilDestroyed()
    ).subscribe()
  }

  submitForm() {
    let action: Observable<ICreatedProject>;
    if (this.projectId()) {
      action = this.projectService.update({projectId: this.projectId() as number, data: this.form.value})
    } else {
      action = this.projectService.create(this.form.value)
    }
    action.pipe(
      switchMap((res) => {
        const successDialog = this.dialog.open(SuccessDialogComponent, {
          disableClose: true,
          data: {
            dialogContents: this.successDialogContents,
            dialogActions: this.successDialogActions,
          }
        })
        return successDialog.afterClosed().pipe(
          filter((goToProjectDetails) => goToProjectDetails),
          switchMap(() => this.router.navigate(['projects', res.id]))
        )
      }),
    ).subscribe()
  }
}
