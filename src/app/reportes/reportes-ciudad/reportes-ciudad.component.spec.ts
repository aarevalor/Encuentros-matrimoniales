import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesCiudadComponent } from './reportes-ciudad.component';

describe('ReportesCiudadComponent', () => {
  let component: ReportesCiudadComponent;
  let fixture: ComponentFixture<ReportesCiudadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportesCiudadComponent]
    });
    fixture = TestBed.createComponent(ReportesCiudadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
