import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-quali-gr-list',
  templateUrl: './quali-gr-list.page.html',
  styleUrls: ['./quali-gr-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class QualiGrListPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
