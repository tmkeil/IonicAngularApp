import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ModalController,
  IonContent,
  IonButton,
  IonButtons,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonInput,
  IonCard,
  IonItem,
  IonTextarea,
  IonLabel,
  IonSelect,
  IonSelectOption, IonList } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Station } from 'src/app/group.model';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-add-station',
  templateUrl: './add-station.component.html',
  styleUrls: ['./add-station.component.scss'],
  standalone: true,
  imports: [
    IonList, 
    IonLabel, 
    IonTextarea,
    IonItem,
    IonCard,
    IonInput,
    IonTitle,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    CommonModule,
    FormsModule,
    IonSelect,
    IonSelectOption
  ],
})
export class AddStationComponent {

  constructor() {}

  stationName!: string;
  newStat!: Station;

  modalCtrl = inject(ModalController);
  groupService = inject(GroupService);
  @Input() groupId!: number;


  dismissModal() {
    this.modalCtrl.dismiss();
  }


  async confirmModal(grID: number) {
    const newStatID = await this.groupService.getNewStatID(grID);
    this.newStat = {
      name: this.stationName,
      stationID: newStatID,
      grID: grID,

    }

    if (this.stationName != null) {
      await this.groupService.addStation(this.newStat, grID);
      this.dismissModal();
      
    }

  }

}
