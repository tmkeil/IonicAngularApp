import { AfterViewInit, Component, Input, OnInit, inject } from '@angular/core';
import { ModalController, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonCard, IonList, IonItem, IonInput } from '@ionic/angular/standalone';
import { Station } from 'src/app/group.model';
import { FormsModule } from '@angular/forms';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-edit-station',
  templateUrl: './edit-station.component.html',
  styleUrls: ['./edit-station.component.scss'],
  standalone: true,
  imports: [IonInput, IonItem, IonList, IonCard, IonContent, IonTitle, IonButton, IonButtons, IonToolbar, IonHeader, FormsModule]
})
export class EditStationComponent  implements OnInit {

  constructor(private modalCtrl: ModalController) { 
    
  }

  groupService = inject(GroupService)
  @Input() selectedStation!: Station;
  stationName!: string;
  
  ngOnInit(): void {
    this.stationName = this.selectedStation.name;
  }

  dismissModal(){
    this.modalCtrl.dismiss(null,'cancel');
  }

  async confirmModal(){
    let groupArray = await this.groupService.getGList()
    const grIndex = await this.groupService.getGroupIndexByGroupID(this.selectedStation.grID)
    const statIndex = await this.groupService.getStationIndexByID(this.selectedStation.stationID, this.selectedStation.grID, groupArray)
    groupArray[grIndex].stations[statIndex].name = this.stationName;

    await this.groupService.setStorage('groups', groupArray)

    this.modalCtrl.dismiss({message: 'Test ausm Modal'}, 'confirm');
  }

}
