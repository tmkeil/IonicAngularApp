import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EinteilungPage } from './einteilung.page';

describe('EinteilungPage', () => {
  let component: EinteilungPage;
  let fixture: ComponentFixture<EinteilungPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EinteilungPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
