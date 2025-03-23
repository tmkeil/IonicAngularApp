import { Component, inject, Input, OnInit } from '@angular/core';
import {
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-einteilungs-preferences-modal',
  templateUrl: './einteilungs-preferences-modal.component.html',
  styleUrls: ['./einteilungs-preferences-modal.component.scss'],
  standalone: true,
  imports: [
    IonCardContent,
    IonCard,
    IonInput,
    IonLabel,
    IonItem,
    IonButton,
    IonContent,
  ],
})
export class EinteilungsPreferencesModalComponent implements OnInit {
  groupService = inject(GroupService);
  constructor() {
    addIcons({});
  }

  @Input() rounds!: number;

  einteilung() {
    this.groupService.rounds.emit(this.value);
    this.groupService.startEinteilung.emit();
  }

  ngOnInit() {
    this.value = this.rounds;
  }

  value!: number;

  increaseValue() {
    if (this.value < 8) {
      this.value++;
    }
  }

  decreaseValue() {
    if (this.value > 1) {
      this.value--;
    }
  }
}
