import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpFormComponent } from './emp-form.component';

describe('EmpFormComponent', () => {
  let component: EmpFormComponent;
  let fixture: ComponentFixture<EmpFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmpFormComponent]
    });
    fixture = TestBed.createComponent(EmpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
