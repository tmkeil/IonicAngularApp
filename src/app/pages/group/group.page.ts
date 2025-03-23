import { Component, EnvironmentInjector, OnInit, inject } from '@angular/core';
import {
  IonTabBar,
  IonTabs,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, constructOutline } from 'ionicons/icons';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonTabBar,
    IonTabs,
    IonTabButton,
    IonIcon,
    RouterModule,
  ],
})
export class GroupPage implements OnInit {
  id = 3;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService
  ) {
    addIcons({ person, constructOutline });
    this.groupService.wert = this.id;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];

      this.groupService.groupID.emit(+params['id']);
      this.groupService.wert = +params['id'];
    });
  }
}
