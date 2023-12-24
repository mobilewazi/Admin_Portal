import { Component, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { IconListEnum, IconService } from '@mwazi/shared/icons';
import { ProjectService } from '@mzima/shared/projects';
import { tap } from 'rxjs';
import { IProject } from '@mwazi/shared/data-models';

@Component({
  standalone: true,
  templateUrl: 'activate-project.component.html',
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule
  ],
  styleUrls: ['activate-project.component.scss']
})

export class ActivateProjectComponent{
  projectIsActive = signal(false);
  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: IProject,
    private matDialogRef: MatDialogRef<ActivateProjectComponent>,
    private projectService: ProjectService,
    iconService: IconService
  ) {
   this.projectIsActive.set(this.data.status === 'Active')
    iconService.registerIcons([
      IconListEnum.Deactivate,
      IconListEnum.Activate,
    ])
  }

  activateProject() {
    this.projectService.activate({
      projectId: this.data.id, deactivateProject: this.data.status === 'Active'
    }).pipe(
      tap((res) => {
        this.matDialogRef.close(res.responseObject)
      })
    ).subscribe()

  }
}
