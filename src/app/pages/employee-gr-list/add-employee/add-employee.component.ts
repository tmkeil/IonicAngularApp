import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ModalController,
  IonContent,
  IonButton,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonInput,
  IonCard,
  IonItem,
  IonList } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Employee } from 'src/app/group.model';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
  standalone: true,
  imports: [IonList,
    IonItem,
    IonCard,
    IonInput,
    IonTitle,
    IonHeader,
    IonToolbar,
    IonButton,
    IonContent,
    CommonModule,
    FormsModule,
  ],
})
export class AddEmployeeComponent {

  constructor() {}

  employeeName!: string;
  newEmp!: Employee;

  modalCtrl = inject(ModalController);
  groupService = inject(GroupService);
  @Input() groupId!: number;


  dismissModal() {
    this.modalCtrl.dismiss();
  }

  async confirmModal(grID2: number) {
    const newEmpID = await this.groupService.getNewEmpID(grID2);
    const empStations = await this.groupService.getEmployeeStations();
    this.newEmp = {
      name: this.employeeName,
      id: newEmpID,
      avail: true,
      grID2: grID2,
      activeGroup: grID2,
      empStations: empStations

    }

    if (this.employeeName != null) {
      await this.groupService.addEmployee(this.newEmp, this.groupId);
      this.dismissModal();
    }
  }
}
