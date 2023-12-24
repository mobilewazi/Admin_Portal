import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebPagesProjectsComponent } from './projects.component';

describe('WebPagesProjectsComponent', () => {
  let component: WebPagesProjectsComponent;
  let fixture: ComponentFixture<WebPagesProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebPagesProjectsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WebPagesProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
