import { Component, inject, Input, OnInit } from '@angular/core';
import {
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonInput, IonList } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Group } from 'src/app/group.model';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-einteilungs-preferences-modal',
  templateUrl: './einteilungs-preferences-modal.component.html',
  styleUrls: ['./einteilungs-preferences-modal.component.scss'],
  standalone: true,
  imports: [IonList,
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
  @Input() matrix!: any[];
  @Input() groups!: Group[];

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


  async sendTelegramMessages() {
    console.log("\ntrying to send telegram messages");
    const employee_station_pairs = await this.groupService.getEmployeeStationPairs(this.matrix, this.groups);
    const assignedEmployees = employee_station_pairs.map(pair => pair.emp);

    console.log("assignedEmployees: ", JSON.parse(JSON.stringify(assignedEmployees)));
    console.log("employee_station_pairs: ", JSON.parse(JSON.stringify(employee_station_pairs)));

    await this.groupService.getChatIds(assignedEmployees);
    await this.groupService.sendTelegramMessages(employee_station_pairs);
  }
}
