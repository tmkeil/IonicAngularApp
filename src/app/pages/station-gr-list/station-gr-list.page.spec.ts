import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StationGrListPage } from './station-gr-list.page';

describe('StationGrListPage', () => {
  let component: StationGrListPage;
  let fixture: ComponentFixture<StationGrListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StationGrListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
