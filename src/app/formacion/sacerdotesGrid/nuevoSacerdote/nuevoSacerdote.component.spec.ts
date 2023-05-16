import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { NuevoSacerdoteComponent } from "./nuevoSacerdote.component";

describe("NuevoPrimerPilarComponent", () => {
  let component: NuevoSacerdoteComponent;
  let fixture: ComponentFixture<NuevoSacerdoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NuevoSacerdoteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoSacerdoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
