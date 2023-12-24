import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewProjectReportComponent } from './view-project-report.component';

describe('ReportComponent', () => {
  let component: ViewProjectReportComponent;
  let fixture: ComponentFixture<ViewProjectReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProjectReportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewProjectReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
