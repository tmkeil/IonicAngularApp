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
  api_key!: string;

  // Index of the employee in its own group array
  employeeIndex!: number;

  // Index of the group in the group array, of the currently selected employee
  groupIndex!: number;

  // Index of the group in the group array, which is currently selected inside the "edit employee modal"
  groupIndexStat!: number;

  // Index of the currently selected group (in the "edit employee modal") inside the employee's empStations array
  empStationsIndex!: number;

  constructor(private modalCtrl: ModalController, private swiper: Swiper) {}

  groupService = inject(GroupService);
  groupArr!: Group[];
  @ViewChild('swiper')
  swiperRef?: ElementRef;

  async ngOnInit() {
    await this.loadGroupList();
    this.employeeName = this.selectedEmployee.name;
    this.api_key = this.selectedEmployee.api_key;
    this.groupIndex = await this.groupService.getGroupIndexByGroupID(
      this.selectedEmployee.grID2
    );

    // On default, the groupIndexStat is set to the groupIndex of the selected employee
    this.groupIndexStat = this.groupIndex;

    this.employeeIndex = await this.groupService.getEmployeeIndexByID(
      this.selectedEmployee.id,
      this.selectedEmployee.grID2,
      this.selectedEmployee.grID2,
      this.groupArr
    );

    this.empStationsIndex = await this.groupService.getEmployeeStationsIndex(
      this.groupArr,
      this.selectedEmployee.grID2,
      this.groupIndex,
      this.employeeIndex
    );
  }

  async changeStatus(z: number) {
    const groupArr = this.groupArr;

    const employee = groupArr[this.groupIndex].employees[this.employeeIndex];
    const empStations = employee.empStations[this.empStationsIndex];

    const currentStatus = empStations.stations[z].status;
    empStations.stations[z].status = !currentStatus;

    await this.groupService.setStorage('groups', groupArr);
  }

  async loadGroupList() {
    this.groupArr = await this.groupService.getGList();
  }

  async clickGroupIndex(index: number, group: Group[]) {
    this.groupIndexStat = index;

    this.empStationsIndex = await this.groupService.getEmployeeStationsIndex(
      group,
      group[index].grID1,
      this.groupIndex,
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
    groupArray[grIndex].employees[empIndex].api_key = this.api_key;

    await this.groupService.setStorage('groups', groupArray);

    this.modalCtrl.dismiss({ updatedArray: groupArray }, 'confirm');
  }
}
