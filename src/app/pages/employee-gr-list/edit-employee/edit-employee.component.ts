import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonLabel,
  IonItem,
  IonList,
  IonInput,
  IonCheckbox,
  IonChip,
} from '@ionic/angular/standalone';
import { Employee, Group } from 'src/app/group.model';
import { FormsModule } from '@angular/forms';
import { GroupService } from 'src/app/services/group.service';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { IonicSlides } from '@ionic/angular/standalone';
import Swiper from 'swiper';

register();

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss'],
  standalone: true,
  imports: [
    IonChip,
    IonCheckbox,
    IonInput,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonButtons,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    FormsModule,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EditEmployeeComponent implements OnInit {
  swiperModules = [IonicSlides];
  @Input() selectedEmployee!: Employee;
  employeeName!: string;
  employeeIndex!: number;
  groupIndexStat!: number;
  groupIndexEmp!: number;
  empStationsIndex!: number;

  constructor(private modalCtrl: ModalController, private swiper: Swiper) {}

  groupService = inject(GroupService);
  groupArr!: Group[];
  @ViewChild('swiper')
  swiperRef?: ElementRef;
  statusArray!: any[];

  async ngOnInit() {
    this.loadGroupList();
    this.employeeName = this.selectedEmployee.name;
    this.groupIndexStat = await this.groupService.getGroupIndexByGroupID(
      this.selectedEmployee.grID2
    );
    this.groupIndexEmp = await this.groupService.getGroupIndexByGroupID(
      this.selectedEmployee.grID2
    );
    this.employeeIndex = await this.groupService.getEmployeeIndexByID(
      this.selectedEmployee.id,
      this.selectedEmployee.grID2,
      this.selectedEmployee.grID2,
      this.groupArr
    );

    this.empStationsIndex = await this.groupService.getEmployeeStationsIndex(
      this.groupArr,
      this.selectedEmployee.grID2,
      this.groupIndexEmp,
      this.employeeIndex
    );
    let stats: any[] = [];
    let Obj = this.selectedEmployee.empStations;
    for (let i = 0; i < Obj.length; i++) {
      const grID3 = Obj[i].grID3;
      const grIndex = await this.groupService.getGroupIndexByGroupID(grID3);
      stats[grIndex] = [];
      for (let j = 0; j < Obj[i].stations.length; j++)
        stats[grIndex][j] = Obj[i].stations[j].status;
    }
    this.statusArray = stats;
  }

  async changeStatus(groupIndexStat: number, z: number, GroupArr: Group[]) {
    GroupArr[this.groupIndexEmp].employees[this.employeeIndex].empStations[
      this.empStationsIndex
    ].stations[z].status = !this.statusArray[groupIndexStat][z];
    await this.groupService.setStorage('groups', GroupArr);
    this.statusArray[groupIndexStat][z] = !this.statusArray[groupIndexStat][z];
  }

  async loadGroupList() {
    this.groupArr = await this.groupService.getGList();
  }

  async clickGroupIndex(index: number, group: Group[]) {
    this.groupIndexStat = index;
    const grID = group[this.groupIndexStat].grID1;
    this.empStationsIndex = await this.groupService.getEmployeeStationsIndex(
      group,
      grID,
      this.groupIndexEmp,
      this.employeeIndex
    );
  }

  checked: boolean = true;

  async confirmModal() {
    let groupArray = await this.groupService.getGList();
    const grID = this.selectedEmployee.grID2;
    const grIndex = await this.groupService.getGroupIndexByGroupID(grID);
    const empID = this.selectedEmployee.id;
    const empIndex = await this.groupService.getEmployeeIndexByID(
      empID,
      grID,
      grID,
      groupArray
    );
    groupArray[grIndex].employees[empIndex].name = this.employeeName;

    await this.groupService.setStorage('groups', groupArray);

    this.modalCtrl.dismiss({ updatedArray: groupArray }, 'confirm');
  }
}
