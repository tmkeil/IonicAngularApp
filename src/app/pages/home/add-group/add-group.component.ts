import { Component, OnInit, booleanAttribute, inject } from '@angular/core';
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
  IonSelectOption, IonList, IonListHeader } from '@ionic/angular/standalone';
import { NgModel, FormsModule } from '@angular/forms';
import { Group } from 'src/app/group.model';
import { Employee } from 'src/app/group.model';
import { Station } from 'src/app/group.model';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss'],
  standalone: true,
  imports: [IonListHeader, IonList, IonLabel, 
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
export class AddGroupComponent implements OnInit {
  constructor() {}

  groupName!: string;
  newGroup!: Group;

  modalCtrl = inject(ModalController);
  groupService = inject(GroupService);

  ngOnInit() {}

  dismissModal() {
    // this.modalCtrl.dismiss(null, 'cancel');
    this.modalCtrl.dismiss();
  }

  async confirmModal() {
    const newGroupID = await this.groupService.getNewGroupID(); // Warten auf die Auflösung der Promise
    this.newGroup = {
      name: this.groupName,
      grID1: newGroupID!,
      employees: [] as Employee[],
      stations: [] as Station[],
      assign: false

    }

    if (this.groupName != null) {
      console.log("this.groupName ",this.groupName)
      await this.groupService.addGroup(this.newGroup);
      this.dismissModal();
      
    }

  }

}
