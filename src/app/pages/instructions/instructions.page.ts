import { Component } from '@angular/core';
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
  IonMenuToggle, IonItem, IonLabel, IonSplitPane, MenuController } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { informationOutline } from 'ionicons/icons';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.page.html',
  styleUrls: ['./instructions.page.scss'],
  standalone: true,
  imports: [IonSplitPane, IonLabel, IonItem, IonList, 
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
  ],
})
export class InstructionsPage  {
  constructor(private menuCtrl: MenuController) {
    addIcons({ informationOutline });
  }

  paneEnabled = true;

  ionViewWillEnter(){
    this.paneEnabled = true;
    this.menuCtrl.enable(true,'sec')
   
  }

  ionViewWillLeave(){
    this.paneEnabled = false;   
  }
}
