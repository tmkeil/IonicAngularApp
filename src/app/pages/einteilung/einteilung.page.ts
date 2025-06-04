import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonMenu,
  IonList,
  IonMenuToggle,
  IonItem,
  IonLabel,
  IonSplitPane,
  MenuController,
  ModalController,
  IonButton,
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { informationOutline } from 'ionicons/icons';
import { GroupService } from 'src/app/services/group.service';
import { ExchangeEmpsModalComponent } from './exchange-emps-modal/exchange-emps-modal.component';
import { EinteilungsPreferencesModalComponent } from './einteilungs-preferences-modal/einteilungs-preferences-modal.component';

import { Group } from 'src/app/group.model';
import { Employee } from './../../group.model';

@Component({
  selector: 'app-einteilung',
  templateUrl: './einteilung.page.html',
  styleUrls: ['./einteilung.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonSplitPane,
    IonLabel,
    IonItem,
    IonList,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonMenuButton,
    IonMenu,
    IonMenuToggle,
    RouterModule,
    CommonModule,
    FormsModule,
  ],
})
export class EinteilungPage {
  constructor(
    private menuCtrl: MenuController,
    private groupService: GroupService,
    private modalCtrl: ModalController
  ) {
    addIcons({ informationOutline });
    this.loadGroupList();
  }

  async ionViewWillEnter(){
    await this.loadGroupList();
    this.createTableMatrix();

    this.groupService.startEinteilung.subscribe(() => {
      this.createTableMatrix();
    });

    this.groupService.rounds.subscribe((val) => {
      this.Runden = val;
    });
  }

  @ViewChild('tableRef', { static: true }) tableRef: ElementRef | undefined;
  TableMatrix: any[] = [];
  Runden: number = 5;
  Groups: Group[] = [];
  paneEnabled = true;

  async loadGroupList() {
    this.Groups = await this.groupService.getGList();
  }

  ionViewWillLeave() {
    this.paneEnabled = false;
  }

  openPreferences() {
    this.modalCtrl
      .create({
        component: EinteilungsPreferencesModalComponent,
        componentProps: { rounds: this.Runden, matrix: this.TableMatrix , groups: this.Groups},
        initialBreakpoint: 0.5,
        breakpoints: [0, 0.5],
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
  }

  async createTableMatrix() {
    let tableBody = this.tableRef?.nativeElement.children[1];
    let tableHead = this.tableRef?.nativeElement.children[0];
    tableBody.innerHTML = '';
    tableHead.innerHTML = '';

    let Headers: string[] = [];
    for (let i = 0; i < this.Runden; i++) {
      Headers[i] = `${i + 1}`;
    }

    let stationHeaders = `<th></th>`;
    for (let i = 0; i < Headers.length; i++) {
      stationHeaders += `<th colspan="2">${Headers[i]}</th>`;
    }
    const THRow = `<tr>
                    ${stationHeaders}
                 </tr>`;
    tableHead.insertAdjacentHTML('beforeend', THRow);

    //TableMatrix füllen
    // let TableMatrix: any[] = [];

    for (let i = 0; i <= this.Runden; i++) {
      let zahl2 = 0;
      let zahl3 = 0;
      for (let z = 0; z < this.Groups.length; z++) {
        if (i == 0) {
          //Für jede Station (Reihe) ein Array mit Runden (Spalten erstellen)
          for (let j = 0; j < this.Groups[z].stations.length; j++) {
            this.TableMatrix[j + zahl2] = [];
            //i == 0 (Workplaces-Name)
            this.TableMatrix[j + zahl2][i] = this.Groups[z].stations[j];
          }
          zahl2 += this.Groups[z].stations.length;
        }
        //Die employees sammeln, die in dieser Gruppe (z) verfügbar/aktiv sind
        //Dazu eine Funktion im groupService (collectActiveEmps) erstellen
        let activeEmps = await this.groupService.collectActiveEmps(
          this.Groups[z].grID1
        );
        let assignment = await this.PickAvailableEmployees2(
          activeEmps,
          this.Groups[z].stations,
          this.Groups[z].grID1
        );
        //Nun sollte assignment die Indexe der Emps im activeEmps Array enthalten
        for (let a = 0; a < assignment.length; a++) {
          assignment[a] = activeEmps[assignment[a]];
        }
        if (i > 0) {
          for (let a = 0; a < this.Groups[z].stations.length; a++) {
            this.TableMatrix[a + zahl3][i] = assignment[a];
          }
          for (let a = 0; a < this.Groups[z].stations.length; a++) {
            if (this.TableMatrix[a + zahl3][i] == null) {
              this.TableMatrix[a + zahl3][i] = '';
            }
          }
          zahl3 += this.Groups[z].stations.length;
        }
      }
    }

    //Erstellung der Einteilungs-Tabelle mit der TableMatrix
    //TableMatrix[i][j>0] enthält jeweils das Objekt eines Mitarbeiters
    //TableMatrix[i][0] enthält jeweils das Objekt der Station im Array
    //Die 1. Spalte in einer Reihe besteht immer aus dem Stationsnamen TableMatrix[i][0].name und die Reihe enthält die ID der Station
    //Die 2. - x. Spalte in einer Reihe bestehen aus Mitarbeitern, die in den Runden den Stationen zugeteilt werden
    let reihe = 1;
    let indexStationInGroup = 0;
    let groupIndex = 0;
    for (let i = 0; i < this.TableMatrix.length; i++) {
      let assignedEmployee = `<td>${this.TableMatrix[i][0].name}</td>`;

      for (let j = 1; j < this.TableMatrix[i].length; j++) {
        var data_assigned_employee_id = this.TableMatrix[i][j].id;
        var data_assigned_employee_name = this.TableMatrix[i][j].name;
        var grIDEmp = this.TableMatrix[i][j].grID2;

        let grIDStat =
          this.Groups[groupIndex].stations[indexStationInGroup].grID;
        let ID_Stat =
          this.Groups[groupIndex].stations[indexStationInGroup].stationID;
        if (data_assigned_employee_id == null) {
          data_assigned_employee_id = '';
          data_assigned_employee_name = '';
        }
        const E = `<td colspan="2" grIDEmp="${grIDEmp}" employee="${data_assigned_employee_id}" grIDStat="${grIDStat}" station="${ID_Stat}" runde="${j}" reihe="${reihe}"clickC="" sameEmp="" exchange="">
                          ${data_assigned_employee_name}
                  </td>`;
        assignedEmployee += E;
      }

      const employeeRow = `<tr station="${this.TableMatrix[i][0].id}">
                            ${assignedEmployee}
                         </tr>`;
      tableBody.insertAdjacentHTML('beforeend', employeeRow);

      reihe++;
      indexStationInGroup++;
      if (indexStationInGroup >= this.Groups[groupIndex].stations.length) {
        indexStationInGroup = 0;
        groupIndex++;
      }
    }
  }

  async checkVariety(
    assignment: any,
    TableMatrix: any,
    Round: number,
    zahl3: number,
    grID1: number,
    stations: any
  ) {
    let Arr: any[] = [];
    for (let i = 0; i < assignment.length; i++) {
      const last = TableMatrix[i + zahl3][Round - 1];
      const current = assignment[i];

      if (assignment[i] != null && TableMatrix[i][Round - 1] != null) {
        if (last.id == current.id) {
          let indexPossibleSts = [];

          let grIndexOfEmp = await this.groupService.getGroupIndexByGroupID(
            current.grID2
          );
          let empIndex = await this.groupService.getEmployeeIndexByID(
            current.id,
            current.grID2,
            grID1,
            this.Groups
          );
          let index = await this.groupService.getEmployeeStationsIndex(
            this.Groups,
            grID1,
            grIndexOfEmp,
            empIndex
          );
          let PossibleSts = current.empStations[index].stations.filter(
            (item: any) =>
              item.status && item.stationID != stations[i].stationID
          );

          indexPossibleSts = await Promise.all(
            PossibleSts.map(async (item: any) => {
              return await this.groupService.getStationIndexByID(
                item.stationID,
                grID1,
                this.Groups
              );
            })
          );

          Arr[i] = {
            emp: current,
            indexCurrentSt: i,
            changed: false,
            indexPossibleSts: indexPossibleSts,
          };
        } else {
          Arr[i] = null;
        }
      }
    }

    let possibleChange = [];

    for (let i = 0; i < Arr.length; i++) {
      for (let j = 0; j < Arr.length; j++) {
        if (j != i && Arr[i] != null && Arr[j] != null) {
          if (
            hasCommonNumber(Arr[i]!.indexPossibleSts, Arr[j]!.indexPossibleSts)
          ) {
            possibleChange.push([i, j]);
          }
        }
      }
    }

    function hasCommonNumber(arr1: any, arr2: any) {
      for (let i = 0; i < arr1.length; i++) {
        if (arr2.includes(arr1[i])) {
          return true;
        }
      }
      return false;
    }

    // Zuerst das Array mischen
    const shuffledChanges = shuffleChange(possibleChange);
    const uniqueChanges: any[] = [];
    const seenNumbers = new Set();

    function shuffleChange(array: any) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    shuffledChanges.forEach((change: any) => {
      // Überprüfen, ob beide Zahlen im Set noch nicht enthalten sind
      if (!seenNumbers.has(change[0]) && !seenNumbers.has(change[1])) {
        uniqueChanges.push(change);
        // Markiere beide Zahlen als gesehen
        seenNumbers.add(change[0]);
        seenNumbers.add(change[1]);
      }
    });

    for (let j = 0; j < uniqueChanges.length; j++) {
      for (let i = 0; i < Arr.length; i++) {
        if (Arr[i] != null) {
          if (
            Arr[i]!.indexCurrentSt == uniqueChanges[j][0] &&
            Arr[i]!.changed != true
          ) {
            const wert = Arr[i]!.indexCurrentSt;
            Arr[i]!.indexCurrentSt = uniqueChanges[j][1];
            Arr[i]!.changed = true;
            Arr[uniqueChanges[j][1]]!.changed = true;
            Arr[uniqueChanges[j][1]]!.indexCurrentSt = wert;
          }
        }
      }
    }

    // Funktion zum Vergleich der Objekte
    function compare(a: any, b: any) {
      // Wenn a null ist
      if (a === null) {
        // Wenn b auch null ist, dann gleicher Index
        if (b === null) return 0;
        // Andernfalls schiebe a nach hinten
        return 1;
      }
      // Wenn b null ist, dann schiebe a nach vorne
      if (b === null) return -1;

      // Sortierung basierend auf indexCurrentSt
      return a.indexCurrentSt - b.indexCurrentSt;
    }

    // Sortieren und Index der Null-Werte behalten
    var nullIndices: any[] = [];
    Arr.forEach(function (element, index) {
      if (element === null) {
        nullIndices.push(index);
      }
    });
    Arr = Arr.filter(function (element) {
      return element !== null;
    });
    Arr.sort(compare);

    // Füge Null-Werte an ihre ursprünglichen Positionen zurück
    nullIndices.forEach(function (index) {
      Arr.splice(index, 0, null);
    });

    for (let i = 0; i < assignment.length; i++) {
      if (Arr[i] != null) {
        assignment[i] = Arr[i].emp;
      }
    }

    return assignment;
  }

  async PickAvailableEmployees2(employees: any, stations: any, grID1: number) {
    function bpm(bpGraph: any, u: number, seen: any, matchR: any) {
      // Try every job one by one
      for (let v = 0; v < stations.length; v++) {
        // If applicant u is interested
        // in job v and v is not visited
        if (bpGraph[u][v] && !seen[v]) {
          // Mark v as visited
          seen[v] = true;

          // If job 'v' is not assigned to
          // an applicant OR previously
          // assigned applicant for job v (which
          // is matchR[v]) has an alternate job available.
          // Since v is marked as visited in the
          // above line, matchR[v] in the following
          // recursive call will not get job 'v' again
          if (matchR[v] < 0 || bpm(bpGraph, matchR[v], seen, matchR)) {
            //Wenn u2 letzte Runde schon an der Station war, dann zuerst den nächsten Mitarbeiter prüfen
            //Wenn für diesen (nächsten) Mitarbeiter bpm() false ist, dann den nächsten prüfen...
            //Wenn es keinen anderen gibt, dann u2 von ganz vorn nehmen.

            matchR[v] = u;
            return true;
          }
        }
      }
      return false;
    }

    // Returns maximum number
    // of matching from M to N
    const maxBPM = async (bpGraph: any) => {
      // An array to keep track of the
      // applicants assigned to jobs.
      // The value of matchR[i] is the
      // applicant number assigned to job i,
      // the value -1 indicates nobody is assigned.
      let matchR = new Array(stations.length);
      // Initially all jobs are available
      for (let i = 0; i < stations.length; ++i) matchR[i] = -1;
      // Count of jobs assigned to applicants
      let result = 0;
      let anzahlEmps = A.length;
      let arr: any = [];
      for (let i = 0; i < A.length; i++)
        arr[i] = A[i];
      for (let u = 0; u < A.length; u++) {
        let randomIndexEmp = Math.floor(Math.random() * (anzahlEmps - u));
        if (arr[randomIndexEmp] == null) {
          arr.splice(randomIndexEmp, 1);
          continue;
        }
        let grID2 = arr[randomIndexEmp].grID2;
        let u2 = await employees.findIndex(
          (item: any) =>
            item.id === arr[randomIndexEmp].id && item.grID2 === grID2
        );

        arr.splice(randomIndexEmp, 1);
        //Wenn u2 letzte Runde schon an der Station war, dann zuerst den nächsten Mitarbeiter prüfen
        //Wenn für diesen (nächsten) Mitarbeiter bpm() false ist, dann den nächsten prüfen...
        //Wenn es keinen anderen gibt, dann u2 von ganz vorn nehmen.

        // Mark all jobs as not seen
        // for next applicant.
        let seen = new Array(stations.length);
        for (let i = 0; i < stations.length; ++i) seen[i] = false;

        // Find if the applicant 'u' can get a job
        if (bpm(bpGraph, u2, seen, matchR)) result++;
      }
      return matchR;
    };

    let bpGraph: any[] = [];
    let A = employees;
    for (let i = 0; i < A.length; i++) {
      bpGraph[i] = [];
      let grIndexEmp = await this.groupService.getGroupIndexByGroupID(
        A[i].grID2
      );
      let empIndex = await this.groupService.getEmployeeIndexByID(
        A[i].id,
        A[i].grID2,
        A[i].grID2,
        this.Groups
      );
      let index = await this.groupService.getEmployeeStationsIndex(
        this.Groups,
        grID1,
        grIndexEmp,
        empIndex
      );
      for (let j = 0; j < stations.length; j++) {
        bpGraph[i][j] =
          A[i] != null ? A[i].empStations[index].stations[j].status : null;
      }
    }

    let returnVar = await maxBPM(bpGraph);
    return returnVar;
  }

  async handleTableMatrixClick(event: Event) {
    let tbody = this.tableRef?.nativeElement.children[1];
    let El = event.target as HTMLElement;

    let R = El.getAttribute('runde');

    const checkClickC = () => {
      let trElmts = tbody.children;
      for (let i = 0; i < trElmts.length; i++) {
        let tdElmts = trElmts[i].children;
        for (let j = 0; j < tdElmts.length; j++) {
          let tdE = tdElmts[j];
          if (tdE.getAttribute('clickC') === '1') {
            return tdE;
          }
        }
      }
    };

    //Nach dem Attribut 'clickC' schauen.
    //Das Element mit einem clickC Wert '1' ist das zuletzt geklickte TD.
    let lastEl = checkClickC();

    const openExchangeEmpsModal = async (emps: Employee[], cspan: number) => {
      const modal = await this.modalCtrl.create({
        component: ExchangeEmpsModalComponent,
        componentProps: {
          exchangeEmps: emps,
          colspan: cspan,
        },
        initialBreakpoint: 1,
        breakpoints: [0, 1],
      });
      await modal.present();
      // Warten bis das Modal geschlossen wird und die Daten erhalten
      const result = await modal.onDidDismiss();
      // Rückgabe der Daten aus dem Modal
      return result.data;
    };

    const checkDoubleClick = async (El: any) => {
      let c = El.getAttribute('clickC');
      if (c != '') {
        //TD wurde 2 mal hintereinander gedrückt. Prüfe, ob es emps gibt, die in der Runde noch
        //nicht zugeteilt wurden, die diese Stat ebenfalls ausführen können
        //Öffne dann ein Modal oder Toast, in dem man den emp auswählen kann, der für den aktuellen emp einwechseln soll
        //Extrahiere die StationID der Station, auf der der geklickte Employee sitzt
        //<td grIDEmp="${grIDEmp}" employee="${data_assigned_employee_id}" grIDStat="${grIDStat}" station="${TableMatrix[i][0].id}" runde="${j}" clickC="" sameEmp="" exchange=""
        let clickedStationID = parseInt(El.getAttribute('station'), 10);
        let clicked_grIDStat = +El.getAttribute('gridstat');
        let availableEmps: Employee[] = [];
        //Sammle alle Employees aller Gruppen, die die Station ausführen können
        for (let i = 0; i < this.Groups.length; i++) {
          for (let j = 0; j < this.Groups[i].employees.length; j++) {
            let emp = this.Groups[i].employees[j];
            let empStatIndex = await this.groupService.getEmployeeStationsIndex(
              this.Groups,
              clicked_grIDStat,
              i,
              j
            );
            let statIndex = await this.groupService.getStationIndexByID(
              clickedStationID,
              clicked_grIDStat,
              this.Groups
            );
            if (
              emp.empStations[empStatIndex].stations[statIndex].status == true
            ) {
              availableEmps.push(emp);
            }
          }
        }

        //Create Exchange Table List
        //Bereits zugeteilte aus der gleichen Runde aus availableEmps entfernen
        let trElmts = tbody.children;
        for (let i = 0; i < trElmts.length; i++) {
          let tdElmts = trElmts[i].children;
          for (let j = 0; j < tdElmts.length; j++) {
            let tdE = tdElmts[j];
            if (tdE.getAttribute('runde') === R) {
              let empID = parseInt(tdE.getAttribute('employee') || '-1', 10);
              let grIDEmp = parseInt(tdE.getAttribute('grIDEmp') || '-1', 10);
              let toDeleteIndex = availableEmps.findIndex(
                (item: Employee) => item.id === empID && item.grID2 === grIDEmp
              );
              availableEmps.splice(toDeleteIndex, 1);
            }
          }
        }
        let cspan = parseInt(El.getAttribute('colspan') || '-1', 10);
        let e = await openExchangeEmpsModal(availableEmps, cspan);
        if (e != undefined) {
          if (e.status == 0) {
            El.setAttribute('employee', e.emp.id);
            El.setAttribute('gridemp', e.emp.grID2);
            El.textContent = e.emp.name;
          } else if (e.status == 1) {
            let reihe = parseInt(El.getAttribute('reihe') || '-1', 10) - 1;
            let runde = parseInt(El.getAttribute('runde') || '-1', 10);
            let row = tbody.children[reihe];
            let cell = row.cells[runde];

            const newCell1 = document.createElement('td');
            newCell1.colSpan = 1;
            newCell1.textContent = El.textContent;
            const a = cell.getAttribute('employee');
            const b = cell.getAttribute('gridemp');
            const c = cell.getAttribute('runde');
            const d = cell.getAttribute('reihe');
            const ef = cell.getAttribute('station');
            const fg = cell.getAttribute('grIDStat');

            newCell1.setAttribute('employee', a);
            newCell1.setAttribute('gridemp', b);
            newCell1.setAttribute('runde', c);
            newCell1.setAttribute('reihe', d);
            newCell1.setAttribute('station', ef);
            newCell1.setAttribute('grIDStat', fg);

            const newCell2 = document.createElement('td');
            newCell2.colSpan = 1;
            newCell2.textContent = e.emp.name;
            newCell2.setAttribute('employee', e.emp.id);
            newCell2.setAttribute('gridemp', e.emp.grID2);
            newCell2.setAttribute('runde', c);
            newCell2.setAttribute('reihe', d);
            newCell2.setAttribute('station', ef);
            newCell2.setAttribute('grIDStat', fg);
            row.replaceChild(newCell2, cell);
            row.insertBefore(newCell1, newCell2);
          } else if (e.status == 2) {
            if (cspan == 1) {
              let reihe = parseInt(El.getAttribute('reihe') || '-1', 10) - 1;
              let runde = parseInt(El.getAttribute('runde') || '-1', 10);
              let sta = parseInt(El.getAttribute('station') || '-1', 10);
              let grSta = parseInt(El.getAttribute('grIDStat') || '-1', 10);
              let row = tbody.children[reihe];
              let cell0 = row.cells[runde - 1];
              let cell1 = row.cells[runde];
              let cell2 = row.cells[runde + 1];
              reihe++;
              const newCell = document.createElement('td');
              newCell.colSpan = 2;
              newCell.setAttribute('runde', runde.toString());
              newCell.setAttribute('reihe', reihe.toString());
              newCell.setAttribute('station', sta.toString());
              newCell.setAttribute('grIDStat', grSta.toString());
              if (parseInt(cell0.getAttribute('runde') || '-1', 10) == runde) {
                let emp = parseInt(cell0.getAttribute('employee') || '-1', 10);
                let grEmp = parseInt(cell0.getAttribute('gridemp') || '-1', 10);
                newCell.setAttribute('employee', emp.toString());
                newCell.setAttribute('gridemp', grEmp.toString());
                newCell.textContent = cell0.textContent;
                row.replaceChild(newCell, cell0);
              } else if (
                parseInt(cell2.getAttribute('runde') || '-1', 10) == runde
              ) {
                let emp = parseInt(cell2.getAttribute('employee') || '-1', 10);
                let grEmp = parseInt(cell2.getAttribute('gridemp') || '-1', 10);
                newCell.setAttribute('employee', emp.toString());
                newCell.setAttribute('gridemp', grEmp.toString());
                newCell.textContent = cell2.textContent;
                row.replaceChild(newCell, cell2);
              }
              cell1.remove();
            } else {
              El.textContent = '';
              El.setAttribute('employee', '');
              El.setAttribute('gridemp', '');
            }
          }
        }
      }
      return;
    };

    const reset_Clicks_Attributes = () => {
      let trElmts = tbody.children;
      for (let i = 0; i < trElmts.length; i++) {
        let tdElmts = trElmts[i].children;
        for (let j = 0; j < tdElmts.length; j++) {
          tdElmts[j].setAttribute('clickC', '');
          tdElmts[j].setAttribute('sameEmp', '');
          tdElmts[j].setAttribute('exchange', '');
        }
      }
    };

    const checkChangeEmps = async (El: HTMLElement, lastEl: HTMLElement) => {
      //Checke ob El ein attribut exchange='true' besitzt
      //Dann tausche die employees El und lastEl in der Runde
      let wert = El.getAttribute('exchange');
      //Wenn auf ein TD Element geklickt wird, dessen changeEmp Wert "true" ist, dann tausche die employees in den TDs
      if (wert == 'true') {
        //`<td grIDEmp="${grIDEmp}" employee="${data_assigned_employee_id}" grIDStat="${grIDStat}" station="${TableMatrix[i][0].id}" runde="${j}" clickC="" sameEmp="" exchange="">
        //Tausche die Attributswerte der beiden TDs miteinander. Danach den innerText des TDs.
        //Attribute => grIDEmp und employee
        //Werte
        let last_grIDEmp = lastEl.getAttribute('grIDEmp')!;
        let last_employee = lastEl.getAttribute('employee')!;
        let lastText = lastEl.textContent;
        let grIDEmp = El.getAttribute('grIDEmp')!;
        let employee = El.getAttribute('employee')!;
        let Text = El.textContent;

        //Tausche
        lastEl.setAttribute('grIDEmp', grIDEmp);
        lastEl.setAttribute('employee', employee);
        El.setAttribute('grIDEmp', last_grIDEmp);
        El.setAttribute('employee', last_employee);

        El.textContent = lastText;
        lastEl.textContent = Text;
      }
    };

    if (lastEl) {
      await checkDoubleClick(El);
      await checkChangeEmps(El, lastEl);
      reset_Clicks_Attributes();
      return;
    }
    El.setAttribute('clickC', '1');
    const markSameEmps = () => {
      let selEmpId = El.getAttribute('employee');
      let selGrIDEmp = El.getAttribute('grIDEmp');
      let trElmts = tbody.children;
      for (let i = 0; i < trElmts.length; i++) {
        let tdElmts = trElmts[i].children;
        for (let j = 0; j < tdElmts.length; j++) {
          let tdE = tdElmts[j];
          if (
            tdE.getAttribute('employee') === selEmpId &&
            tdE.getAttribute('grIDEmp') === selGrIDEmp
          ) {
            tdE.setAttribute('sameEmp', 'true');
          }
        }
      }
    };

    //<td grIDEmp="${grIDEmp}" employee="${data_assigned_employee_id}" grIDStat="${grIDStat}" station="${TableMatrix[i][0].id}" runde="${j}" clickC="" sameEmp="" exchange=""
    //convert function declaration to arrow function to get access to class properties inside this function
    const markChangeEmps = async () => {
      let trElmts = tbody.children;
      for (let i = 0; i < trElmts.length; i++) {
        let tdElmts = trElmts[i].children;
        for (let j = 0; j < tdElmts.length; j++) {
          let tdE = tdElmts[j];

          if (
            tdE.getAttribute('runde') === R &&
            El.getAttribute('reihe') != tdE.getAttribute('reihe')
          ) {
            let empID = parseInt(El.getAttribute('employee') || '-1', 10);
            let grIDEmp = parseInt(El.getAttribute('grIDEmp') || '-1', 10);

            let TDstatID = parseInt(tdE.getAttribute('station') || '-1', 10);
            let TDgrIDstat = parseInt(tdE.getAttribute('grIDStat'), 10);

            let TDstaIndex = await this.groupService.getStationIndexByID(
              TDstatID,
              TDgrIDstat,
              this.Groups
            );

            let empIndex;
            let groupIndex;
            let emp;
            let status;
            let empStationsIndex;
            if (empID != -1 && grIDEmp != -1) {
              empIndex = await this.groupService.getEmployeeIndexByID(
                empID,
                grIDEmp,
                grIDEmp,
                this.Groups
              );
              groupIndex = await this.groupService.getGroupIndexByGroupID(
                grIDEmp
              );
              emp = this.Groups[groupIndex].employees[empIndex];

              empStationsIndex =
                await this.groupService.getEmployeeStationsIndex(
                  this.Groups,
                  TDgrIDstat,
                  groupIndex,
                  empIndex
                );

              status =
                emp.empStations[empStationsIndex].stations[TDstaIndex].status;
            }

            //clickedEmp kann Stat oder clickedEmp ist null (auf td Element ist kein Emp oder kein Emp ist an dieser Stat innerhalb dieser Runde zugeteilt)
            if (status || empID == -1) {
              let TDempID = parseInt(tdE.getAttribute('employee') || '-1', 10);
              let TDgrIDEmp = parseInt(tdE.getAttribute('grIDEmp') || '-1', 10);

              let statID = parseInt(El.getAttribute('station')!, 10);
              let grIDstat = parseInt(El.getAttribute('grIDStat')!, 10);

              let staIndex = await this.groupService.getStationIndexByID(
                statID,
                grIDstat,
                this.Groups
              );

              let TDempIndex;
              let TDgroupIndex;
              let TDemp;
              let empStationsIndex;
              let status2;
              if (TDgrIDEmp != -1 && TDempID != -1) {
                TDempIndex = await this.groupService.getEmployeeIndexByID(
                  TDempID,
                  TDgrIDEmp,
                  TDgrIDEmp,
                  this.Groups
                );
                TDgroupIndex = await this.groupService.getGroupIndexByGroupID(
                  TDgrIDEmp
                );

                TDemp = this.Groups[TDgroupIndex].employees[TDempIndex];
                empStationsIndex = TDemp.empStations.findIndex(
                  (item: any) => item.grID3 === grIDstat
                );

                status2 =
                  TDemp.empStations[empStationsIndex].stations[staIndex].status;
              }

              //Emp auf dieser Stat kann clicked Stat oder es gibt keinen Emp auf dieser Stat
              if (status2 || TDempID == -1) {
                //Set changeEmp true
                tdE.setAttribute('exchange', 'true');
              }
            }
          }
        }
      }
    };
    markSameEmps();
    await markChangeEmps();
  }
}
