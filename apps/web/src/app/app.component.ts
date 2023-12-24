import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LoadingComponent } from '@mwazi/shared/loading';

@Component({
  standalone: true,
  imports: [RouterModule, MatButtonModule, LoadingComponent],
  selector: 'mwazi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'web';
}
