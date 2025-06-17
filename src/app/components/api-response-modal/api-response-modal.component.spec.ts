import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiResponseModalComponent } from './api-response-modal.component';

describe('ApiResponseModalComponent', () => {
  let component: ApiResponseModalComponent;
  let fixture: ComponentFixture<ApiResponseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiResponseModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiResponseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
