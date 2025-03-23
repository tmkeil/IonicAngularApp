import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonMenu,
  IonList,
  IonMenuToggle,
  IonItem,
  IonLabel,
  IonSplitPane,
  MenuController,
  IonFabButton,
  IonFab,
  ModalController,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonFabList,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  informationOutline,
  add,
  trashOutline,
  saveOutline,
  addOutline,
  documentOutline,
} from 'ionicons/icons';
import { RouterModule } from '@angular/router';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupService } from 'src/app/services/group.service';
import { AddGroupComponent } from './add-group/add-group.component';
import { Employee, Group, Station } from 'src/app/group.model';
import { SaveGroupModalComponent } from './save-group-modal/save-group-modal.component';
import { FilePicker } from '@capawesome/capacitor-file-picker';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonFabList,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonFab,
    IonFabButton,
    IonSplitPane,
    IonLabel,
    IonItem,
    IonList,
    IonIcon,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonMenuButton,
    IonMenu,
    IonMenuToggle,
    RouterModule,
    GroupListComponent,
    CommonModule,
  ],
})
export class HomePage implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private menuCtrl: MenuController,
    private groupService: GroupService
  ) {
    addIcons({
      informationOutline,
      saveOutline,
      trashOutline,
      add,
      addOutline,
      documentOutline,
    });

    // this.groupArr = await this.groupService.getGList();
    console.log();
  }

  ngOnInit(): void {
    this.groupService.newArray.subscribe((data) => {
      this.groupArr = data;
    });

    this.loadGroupList();
  }

  groupArr: Group[] = [];
  paneEnabled = true;

  ionViewWillEnter() {
    this.paneEnabled = true;
    this.menuCtrl.enable(true, 'first');
  }

  async loadGroupList() {
    this.groupArr = await this.groupService.getGList();
  }
  ionViewWillLeave() {
    this.paneEnabled = false;
  }

  aID: number = 9;

  addGroupModal() {
    this.modalCtrl
      .create({
        component: AddGroupComponent,
        initialBreakpoint: 0.5,
        breakpoints: [0, 0.5],
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      });
  }

  async deleteGroupButton(grID1: number) {
    await this.groupService.deleteGroup(grID1);
  }

  saveGroupButton(grID1: number, groupName: string, group: Group) {
    this.modalCtrl
      .create({
        component: SaveGroupModalComponent,
        initialBreakpoint: 0.5,
        breakpoints: [0, 0.5],
        componentProps: {
          groupName: groupName,
          groupObj: group,
        },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      });
  }

  async pickFiles() {
    const result = await FilePicker.pickFiles({
      types: ['application/json'],
      multiple: false,
      readData: true,
    });
    if (result) {
      const encodedData = result.files[0].data!;
      // Base64-decodieren und in ein JSON-Objekt parsen
      const decodedData = atob(encodedData);
      let groupObject = JSON.parse(decodedData);

      this.syncNewGroup(groupObject);
    }
  }

  async syncNewGroup(groupObject: Group) {
    groupObject.employees = groupObject.employees.filter(
      (employee: Employee) => employee.grID2 === groupObject.grID1
    );

    groupObject.employees.forEach((employee: Employee) => {
      employee.empStations = employee.empStations.filter(
        (stationGroup) => stationGroup.grID3 === groupObject.grID1
      );
    });

    const GrID1 = await this.groupService.getNewGroupID();

    // Aktualisiere die grID1 des Gruppenobjekts
    groupObject.grID1 = GrID1;

    // Aktualisiere die grID2 aller Mitarbeiter
    groupObject.employees.forEach((employee: Employee) => {
      employee.grID2 = GrID1;
    });

    // Aktualisiere die grID3 aller empStations
    groupObject.employees.forEach((employee: Employee) => {
      employee.empStations.forEach((stationGroup) => {
        stationGroup.grID3 = GrID1;
      });
    });

    // Aktualisiere die grID aller Stationen in empStations
    groupObject.employees.forEach((employee: Employee) => {
      employee.empStations.forEach((stationGroup) => {
        stationGroup.stations.forEach((station) => {
          station.grID = GrID1;
        });
      });
    });

    //Füge das empStations Array der emps der neuen Gruppe in das empStations Array der
    //bestehenden Gruppen in der Gruppenliste ein
    //und setze den status auf false
    const newEmpStations = groupObject.employees[0]?.empStations;
    let groupArray = await this.groupService.getGList();
    if (newEmpStations != null) {
      newEmpStations.forEach((stationGroup) => {
        stationGroup.stations.forEach((station) => {
          station.status = false;
        });
      });

      groupArray.forEach((group: Group) => {
        group.employees.forEach((employee) => {
          employee.empStations = employee.empStations.concat(newEmpStations);
        });
      });
    } else {
      groupArray.forEach((group: Group) => {
        group.employees.forEach((employee) => {
          employee.empStations.push({
            grID3: GrID1,
            stations: [] as Station[],
          });
        });
      });
    }

    //Füge die empStations Arrays bestehender Gruppen aus der Gruppenliste in das
    //empStations Array der neuen Gruppe ein
    //status ist bereits false durch die Funktion getEmployeeStations()
    const empStations = await this.groupService.getEmployeeStations();
    groupObject.employees.forEach((employee: Employee) => {
      employee.empStations = employee.empStations.concat(empStations);
    });

    groupArray.push(groupObject);
    await this.groupService.setStorage('groups', groupArray);
  }
}
