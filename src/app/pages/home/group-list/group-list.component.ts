import { Component, Input } from '@angular/core';
import {
  IonItem,
  IonLabel,
  IonCard,
  IonItemSliding,
  IonItemOption,
  IonIcon,
  IonItemOptions,
  IonImg,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { RouterModule } from '@angular/router';
import { Group } from 'src/app/group.model';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonCardContent,
    IonImg,
    IonItemOptions,
    IonIcon,
    IonItemOption,
    IonItemSliding,
    IonCard,
    IonLabel,
    IonItem,
    RouterModule,
  ],
})
export class GroupListComponent {
  @Input()
  group!: Group;
  constructor() {
    addIcons({});
  }
}
