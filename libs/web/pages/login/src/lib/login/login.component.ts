import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { AuthService } from 'libs/shared/auth/src';
import { switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'mwazi-login',
  standalone: true,
  imports: [
    GoogleSigninButtonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  @ViewChild('termsOfService') termsOfService?: TemplateRef<any>;
  constructor(
    private authService: SocialAuthService,
    private appAuthService: AuthService,
    private dialog: MatDialog
    ) { }

  ngOnInit() {
    this.authService.authState.pipe(
      switchMap((user) => this.appAuthService.authenticate(user))
    ).subscribe();
  }

  showTermsOfService() {
    if(this.termsOfService) {
      this.dialog.open(this.termsOfService, {
        maxWidth: '800px'
      })
    }

  }
}
