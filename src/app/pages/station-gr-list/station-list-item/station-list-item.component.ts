import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Station } from 'src/app/group.model';
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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
const ANIMATION_BREAKPOINT = 70;

@Component({
  selector: 'app-station-list-item',
  templateUrl: './station-list-item.component.html',
  styleUrls: ['./station-list-item.component.scss'],
  standalone: true,
  imports: [IonRow, IonItem, IonIcon, IonLabel, IonCardContent, IonCard],
})
export class StationListItemComponent  implements OnInit, AfterViewInit {
  trashAnimation!: Animation;
  deleteAnimation!: Animation;
  bigIcon = false;

  constructor(
    private gestureCtrl: GestureController,
    private animationCtrl: AnimationController
  ) {
    addIcons({ trashOutline });
  }

  @Input() sta!: Station;
  @ViewChild(IonItem, { read: ElementRef }) item!: ElementRef;
  @ViewChild('wrapper') wrapper!: ElementRef;
  @ViewChild('trash', { read: ElementRef }) trashIcon!: ElementRef;
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @ViewChild('H', { static: false })
  H!: ElementRef;

  ngOnInit() {}

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
        }
        else {
          style.transform = '';
        }
      },
    });
    moveGesture.enable();


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
    }
    else {
      this.trashAnimation.direction('reverse').play();
    }
  }

}
