import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QualiGrListPage } from './quali-gr-list.page';

describe('QualiGrListPage', () => {
  let component: QualiGrListPage;
  let fixture: ComponentFixture<QualiGrListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QualiGrListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
