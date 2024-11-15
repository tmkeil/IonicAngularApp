import { Component, Input, OnInit, inject } from '@angular/core';
import {
  IonContent,
  IonCard,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonHeader,
  ModalController,
  IonToolbar,
  IonTitle,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Group } from 'src/app/group.model';
import { Platform } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-save-group-modal',
  templateUrl: './save-group-modal.component.html',
  styleUrls: ['./save-group-modal.component.scss'],
  standalone: true,
  imports: [
    IonTitle,
    IonToolbar,
    IonHeader,
    IonButton,
    IonInput,
    IonItem,
    IonList,
    IonCard,
    IonContent,
    CommonModule,
    FormsModule,
  ],
})
export class SaveGroupModalComponent implements OnInit {
  modalCtrl = inject(ModalController);
  plat = inject(Platform);
  constructor() {}

  saveInput!: string;
  @Input() groupName!: string;
  @Input() groupObj!: Group;

  groupObjCopy!: Group;

  ngOnInit() {
    console.log('group: ', this.groupObj);
  }

  async confirmModal() {
    this.groupObjCopy = JSON.parse(JSON.stringify(this.groupObj));
    this.groupObjCopy.name = this.saveInput;

    if (this.checkPlatform()) {
      await Filesystem.writeFile({
        path: this.saveInput + '.json',
        data: JSON.stringify(this.groupObjCopy),
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    } else if (!this.checkPlatform()) {
      const json = JSON.stringify(this.groupObjCopy);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.saveInput}.json`;
      a.click();

      URL.revokeObjectURL(url);
    }

    this.modalCtrl.dismiss();
  }

  checkPlatform() {
    if (
      this.plat.is('pwa') ||
      this.plat.is('mobileweb') ||
      this.plat.is('desktop')
    )
      return 0;
    else return 1;
  }
}
