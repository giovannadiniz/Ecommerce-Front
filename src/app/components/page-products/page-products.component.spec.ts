import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageProductsComponent } from './page-products.component';

describe('PageProductsComponent', () => {
  let component: PageProductsComponent;
  let fixture: ComponentFixture<PageProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
