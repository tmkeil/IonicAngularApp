import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EinteilungsPreferencesModalComponent } from './einteilungs-preferences-modal.component';

describe('EinteilungsPreferencesModalComponent', () => {
  let component: EinteilungsPreferencesModalComponent;
  let fixture: ComponentFixture<EinteilungsPreferencesModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EinteilungsPreferencesModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EinteilungsPreferencesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
