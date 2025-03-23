import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})

export class AppComponent implements OnInit {
  constructor() {}
  ngOnInit() {
        // Statusbar transparent und den Webview überlappen lassen
        StatusBar.setStyle({ style: Style.Dark }); // Style für Statusbar Text
        StatusBar.setOverlaysWebView({ overlay: true }); // Webview überlappen
        StatusBar.setBackgroundColor({ color: '#00000000' }); // Hintergrund transparent machen
        StatusBar.show();
  }
}
