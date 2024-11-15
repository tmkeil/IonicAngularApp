import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { Employee, Group, Station } from 'src/app/group.model';
import {
  IonCard,
  IonCardContent,
  IonLabel,
  IonIcon,
  IonItem,
  IonRow,
  GestureController,
  AnimationController,
  Animation,
  ModalController, IonRadio, IonRadioGroup } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, radioButtonOffOutline, radioButtonOnOutline, ellipse, ellipseOutline } from 'ionicons/icons';
import { EditEmployeeComponent } from '../edit-employee/edit-employee.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from 'src/app/services/group.service';
const ANIMATION_BREAKPOINT = 70;

@Component({
  selector: 'app-employee-list-item',
  templateUrl: './employee-list-item.component.html',
  styleUrls: ['./employee-list-item.component.scss'],
  standalone: true,
  imports: [
    IonRadioGroup,
    IonRadio,
    IonRow,
    IonItem,
    IonIcon,
    IonLabel,
    IonCardContent,
    IonCard,
    FormsModule,
    CommonModule,
  ],
})
export class EmployeeListItemComponent implements AfterViewInit, OnInit {
  trashAnimation!: Animation;
  deleteAnimation!: Animation;
  bigIcon = false;
  id!: number;

  constructor(
    private gestureCtrl: GestureController,
    private animationCtrl: AnimationController,
    private modalCtrl: ModalController
  ) {
    addIcons({trashOutline,ellipseOutline,ellipse});
  }

  @Input() groups!: Group[];
  @Input() emp!: Employee;
  @Input() grID1!: number;
  @ViewChild(IonItem, { read: ElementRef }) item!: ElementRef;
  @ViewChild('wrapper') wrapper!: ElementRef;
  @ViewChild('trash', { read: ElementRef }) trashIcon!: ElementRef;
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @ViewChild('H', { static: false })
  H!: ElementRef;
  groupService = inject(GroupService);

  ngAfterViewInit() {
    this.setupIconAnimations();
    const style = this.item.nativeElement.style;
    const windowWidth = window.innerWidth;
    const testW = 1 * windowWidth;
    const H: HTMLElement = this.H.nativeElement;
    const high = H.offsetHeight;

    this.deleteAnimation = this.animationCtrl
      .create('delete-animation')
      .addElement(this.item.nativeElement)
      .duration(300)
      .easing('ease-out')
      .fromTo('height', high, high);

    const moveGesture = this.gestureCtrl.create({
      el: this.item.nativeElement,
      gestureName: 'move',
      threshold: 0,
      onStart: (ev) => {
        style.transition = '';
      },
      onMove: (ev) => {
        if (ev.deltaX < 0) {
          style.transform = `translate3d(${ev.deltaX}px, 0, 0)`;
          this.item.nativeElement.classList.add('rounded');

          this.wrapper.nativeElement.style['background-color'] = 'red';
        }

        if (ev.deltaX < -ANIMATION_BREAKPOINT && !this.bigIcon) {
          this.animateTrash(true);
        } else if (
          ev.deltaX < 0 &&
          ev.deltaX > -ANIMATION_BREAKPOINT &&
          this.bigIcon
        ) {
          this.animateTrash(false);
        }
      },
      onEnd: (ev) => {
        this.item.nativeElement.classList.remove('rounded');
        style.transition = '0.2s ease-out';
        if (ev.deltaX < -ANIMATION_BREAKPOINT) {
          style.transform = `translate3d(-${testW}px, 0, 0)`;
          this.deleteAnimation.play();
          this.deleteAnimation.onFinish(() => {
            this.delete.emit(true);
          });
        } else {
          style.transform = '';
        }
      },
    });
    moveGesture.enable();
  }

  ngOnInit(): void {
    this.id = this.groupService.wert;
  }

  setupIconAnimations() {
    this.trashAnimation = this.animationCtrl
      .create('trash-animation')
      .addElement(this.trashIcon.nativeElement)
      .duration(300)
      .easing('ease-in')
      .fromTo('transform', 'scale(1)', 'scale(1.5)');
  }

  animateTrash(zoomIn: boolean) {
    this.bigIcon = zoomIn;
    if (zoomIn) {
      this.trashAnimation.direction('alternate').play();
    } else {
      this.trashAnimation.direction('reverse').play();
      this.wrapper.nativeElement.style['background-color'] = 'transparent';
    }
  }

  async toggleAvail(emp: Employee) {
    let id = this.id;
    if (emp.activeGroup != id) {
      emp.activeGroup = id;
    }
    //Wenn der emp in dieser Gruppe aktiv war, dann mache ihn inaktiv, indem der activeGroup Wert -1 gesetzt wird.
    else if (emp.activeGroup == id) {
      emp.activeGroup = -1;
    }
    this.groupService.setStorage('groups', this.groups);
  }

  openEmployee() {
    this.modalCtrl
      .create({
        component: EditEmployeeComponent,
        componentProps: {
          selectedEmployee: this.emp,
        },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((result) => {
        console.log(result.data, result.role);
        if (result.data) {
          this.groupService.updatedEmployeeList.emit(result.data);
        }
      });
  }
}
