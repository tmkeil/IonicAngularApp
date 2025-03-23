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
  IonItem,
  IonFab,
  IonFabButton,
  IonItemGroup,
  IonLabel,
  IonItemDivider,
  IonCard,
  IonCardContent,
  IonListHeader,
} from '@ionic/angular/standalone';
import { GroupService } from 'src/app/services/group.service';
import { addIcons } from 'ionicons';
import { add, chevronBack } from 'ionicons/icons';
import { EditStationComponent } from './edit-station/edit-station.component';
import { AddStationComponent } from './add-station/add-station.component';
import { Group, Station } from 'src/app/group.model';
import { StationListItemComponent } from './station-list-item/station-list-item.component';

@Component({
  selector: 'app-station-gr-list',
  templateUrl: './station-gr-list.page.html',
  styleUrls: ['./station-gr-list.page.scss'],
  standalone: true,
  imports: [
    IonListHeader,
    IonCardContent,
    IonCard,
    IonItemDivider,
    IonLabel,
    IonItemGroup,
    IonFabButton,
    IonFab,
    IonItem,
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
    StationListItemComponent,
  ],
})
export class StationGrListPage implements OnInit {
  groupService = inject(GroupService);
  groupId!: number;
  groupIndex = -1;
  GroupList: Group[] = [];

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
  }

  goHome() {
    this.navCtrl.navigateBack('/home');
  }

  openStation(station: Station) {
    console.log('stat clicked ', station);
    this.modalCtrl
      .create({
        component: EditStationComponent,
        componentProps: {
          selectedStation: station,
        },
        initialBreakpoint: 0.5,
        breakpoints: [0, 0.5],
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((data) => {
        console.log(data.data, data.role);
      });
  }

  addStationModal() {
    this.modalCtrl
      .create({
        component: AddStationComponent,
        componentProps: {
          groupId: this.groupId,
        },
        initialBreakpoint: 0.5,
        breakpoints: [0, 0.5],
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((data) => {
        console.log('Modal wurde wieder geschlossen');
      });
  }

  async removeStation(statID: number, grID: number) {
    await this.groupService.deleteStation(statID, grID);
    this.changeDetector.detectChanges();
  }
}
