import { GroupService } from 'src/app/services/group.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  IonModal,
  IonHeader,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  ModalController,
  IonItemGroup,
  IonItemDivider,
  IonListHeader,
  IonChip,
  IonButton,
} from '@ionic/angular/standalone';
import { Employee, Group } from 'src/app/group.model';

@Component({
  selector: 'app-exchange-emps-modal',
  templateUrl: './exchange-emps-modal.component.html',
  styleUrls: ['./exchange-emps-modal.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonListHeader,
    IonItemDivider,
    IonItemGroup,
    IonLabel,
    IonItem,
    IonList,
    IonContent,
    IonHeader,
    IonModal,
    FormsModule,
    CommonModule,
    IonChip,
  ],
})
export class ExchangeEmpsModalComponent implements OnInit {
  modalCtrl = inject(ModalController);
  grService = inject(GroupService);
  constructor() {}
  @Input() exchangeEmps!: Employee[];
  @Input() colspan!: number;
  Groups: Group[] = [];
  sortedEmps: any[] = [];
  clickedOption: number = 0;

  async ngOnInit() {
    this.Groups = await this.grService.getGList();
    this.sortedEmps = await this.sortEmps(this.exchangeEmps);
  }

  selectOption(option: number) {
    console.log('option selected: ', option);
    this.clickedOption = option;
  }

  async sortEmps(
    emps: Employee[]
  ): Promise<{ groupName: string; groupID: number; emps: Employee[] }[]> {
    let sorted: {
      groupName: string;
      groupID: number;
      emps: Employee[];
    }[] = [];

    for (let i = 0; i < emps.length; i++) {
      let group = sorted.find((g) => g.groupID === emps[i].grID2);
      if (!group) {
        let grIdx = await this.grService.getGroupIndexByGroupID(emps[i].grID2);
        let gName = this.Groups[grIdx].name;
        group = {
          groupName: gName,
          groupID: emps[i].grID2,
          emps: [] as Employee[],
        };
        sorted.push(group);
      }
      group.emps.push(emps[i]);
    }

    return sorted;
  }

  selectEmp(emp: Employee) {
    let status = this.clickedOption == 0 ? 0 : 1;
    let returnD = {
      status: status,
      emp: emp,
    };
    console.log(emp);
    this.modalCtrl.dismiss(returnD);
  }

  removeEmp() {
    this.modalCtrl.dismiss({ status: 2, emp: undefined });
  }
}
