import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NavController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  ModalController,
  IonList,
  IonFab,
  IonFabButton,
  IonItemGroup,
  IonLabel,
  IonItemDivider } from '@ionic/angular/standalone';
import { GroupService } from 'src/app/services/group.service';
import { addIcons } from 'ionicons';
import { add, chevronBack } from 'ionicons/icons';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { Employee, Group, GroupCollection } from 'src/app/group.model';
import { EmployeeListItemComponent } from './employee-list-item/employee-list-item.component';

@Component({
  selector: 'app-employee-gr-list',
  templateUrl: './employee-gr-list.page.html',
  styleUrls: ['./employee-gr-list.page.scss'],
  standalone: true,
  imports: [
    IonItemDivider,
    IonLabel,
    IonItemGroup,
    IonFabButton,
    IonFab,
    IonList,
    IonContent,
    IonTitle,
    IonIcon,
    IonButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    CommonModule,
    FormsModule,
    EmployeeListItemComponent,
  ],
})
export class EmployeeGrListPage implements OnInit {
  groupService = inject(GroupService);
  groupId!: number;
  groupIndex = -1;
  GroupList: Group[] = [];

  collection: GroupCollection[] = [];

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private changeDetector: ChangeDetectorRef
  ) {
    addIcons({ chevronBack, add });
  }

  async ngOnInit() {

    this.groupService.newArray.subscribe((data) => {
      this.GroupList = data;
    });
    this.groupService.groupID.subscribe((id: number) => {
      this.groupId = id;
    });
    this.groupId = this.groupService.wert!;
    this.groupIndex = await this.groupService.getGroupIndexByGroupID(
      this.groupId
    );
    this.GroupList = await this.groupService.getGList();

    this.groupService.updatedEmployeeList.subscribe((result) => {
      this.collect2();
    })
    this.collect2();
  }


  goHome() {
    this.navCtrl.navigateBack('/home');
  }

  addEmployeeModal() {
    this.modalCtrl
      .create({
        component: AddEmployeeComponent,
        componentProps: {
          groupId: this.groupId,
        },
        initialBreakpoint: 1,
        breakpoints: [0, 0.5, 1],
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
  }

  async removeEmployee(empID: number, grID2: number) {
    let isSameGroup = grID2 == this.groupId ? 1 : 0;
    if (isSameGroup) {
      //Wenn der emp in der eigenen Gruppe gelöscht wird, dann lösche den emp aus dieser Gruppe.
      await this.groupService.deleteEmployee(empID, this.groupId, grID2);
    }
    else {
      //Wenn der emp stattdessen in einer fremden Gruppe gelöscht wird, dann setze die Status Werte aller
      //Stationen dieser Gruppe innerhalb des emps auf false.
      let grIndexOfEmployee = await this.groupService.getGroupIndexByGroupID(grID2);
      let empIndex = await this.groupService.getEmployeeIndexByID(empID, grID2, grID2, this.GroupList);

      let empStationsIndex = await this.groupService.getEmployeeStationsIndex(this.GroupList, this.groupId, grIndexOfEmployee, empIndex);
      let stats = this.GroupList[grIndexOfEmployee].employees[empIndex].empStations[empStationsIndex].stations;
      for (let i = 0; i < stats.length; i++) {
        this.GroupList[grIndexOfEmployee].employees[empIndex].empStations[empStationsIndex].stations[i].status = false;
      }
    }
    await this.groupService.setStorage('groups', this.GroupList);
    this.changeDetector.detectChanges();
  }


  async collect2() {
    let empStatIndex;
    this.collection = [];
    for (let x = 0; x < this.GroupList.length; x++) {
      if (this.GroupList[x].grID1 != this.groupId) {
        for (let y = 0; y < this.GroupList[x].employees.length; y++) {
          empStatIndex = await this.groupService.getEmployeeStationsIndex(this.GroupList, this.groupId, x, y);
          for (let z = 0; z < this.GroupList[x].employees[y].empStations[empStatIndex].stations.length; z++) {
            if (this.GroupList[x].employees[y].empStations[empStatIndex].stations[z].status == true) {
              // Überprüfen, ob die Gruppe bereits in der Sammlung existiert
              let group = this.collection.find(g => g.grID === this.GroupList[x].grID1);
              if (!group) {
                // Gruppe existiert nicht, füge neues Gruppenobjekt hinzu
                group = {
                  grName: this.GroupList[x].name,
                  grID: this.GroupList[x].grID1,
                  employees: [] as Employee[]
                };
                this.collection.push(group);
              }
              // Füge den Mitarbeiter zur entsprechenden Gruppe hinzu
              group.employees.push(this.GroupList[x].employees[y]);
              break; // Gehe zum nächsten Employee, da bereits einen passender gefunden wurde
            }
          }
        }
      }
    }
  }
}
