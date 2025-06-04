import { EventEmitter, Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Employee, Group, Station } from '../group.model';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  wert!: number;
  groupID = new EventEmitter<number>();
  newArray = new EventEmitter<Group[]>();
  updatedEmployeeList = new EventEmitter<Group[]>();
  startEinteilung = new EventEmitter<void>();
  rounds = new EventEmitter<number>();

  async getGList() {
    let a = await Preferences.get({ key: 'groups' });
    let aa = JSON.parse(a.value!);
    return aa != null ? aa : [];
  }

  async getGroupIndexByGroupID(id: number) {
    const groupArray = await this.getGList();
    return groupArray.findIndex((item: any) => item.grID1 === id);
  }

  async addGroup(newGroup: Group) {
    console.log('a');
    let groupArray = await this.getGList();
    groupArray.push(newGroup);

    //Füge jedem employee jeder Gruppe, in den empStations die neue Gruppe hinzu
    for (let i = 0; i < groupArray.length; i++) {
      for (let j = 0; j < groupArray[i].employees.length; j++) {
        groupArray[i].employees[j].empStations.push({
          grID3: newGroup.grID1,
          stations: [] as Station[],
        });
      }
    }

    //Speichere das neue GroupArray mit dem Schlüssel für das GroupArray
    this.setStorage('groups', groupArray);
  }

  async setStorage(key: string, value: any) {
    console.log(`[GroupService] setStorage called with key: "${key}"`);
    const stringValue = JSON.stringify(value);
    console.log('Storing value: ', JSON.parse(JSON.stringify(value)));

    await Preferences.set({
      key: key,
      value: stringValue,
    });

    this.newArray.emit(value);
  }

  async getNewGroupID() {
    let groupArray = await this.getGList();
    let nextID: number = groupArray.length;
    let tryId: number = nextID;
    let idExists = false;
    let foundNext = false;

    while (!foundNext) {
      for (let i = 0; i < groupArray.length; i++) {
        let grItem = groupArray[i];
        if (grItem.grID1 == tryId) {
          idExists = true;
          break;
        }
      }
      if (idExists) {
        nextID++;
        tryId = nextID;
        idExists = false;
      } else {
        foundNext = true;
        return tryId;
      }
    }
    return -1;
  }

  async deleteGroup(grID1: number) {
    let groupList = await this.getGList();

    const deleteGroupsInEmployees = async () => {
      //Entferne die Group aus allen employees in allen Groups
      for (let i = 0; i < groupList.length; i++) {
        const grID = groupList[i].grID1;
        for (let j = 0; j < groupList[i].employees.length; j++) {
          const empStatIndex = await this.getEmployeeStationsIndex(
            groupList,
            grID1,
            i,
            j
          );
          groupList[i].employees[j].empStations.splice(empStatIndex, 1);
          await this.setStorage('groups', groupList);
        }
      }
    };

    const index = await this.getGroupIndexByGroupID(grID1);
    groupList.splice(index, 1);
    deleteGroupsInEmployees();

    await this.setStorage('groups', groupList);
  }

  async getEmployeeStationsIndex(
    groupList: Group[],
    grID: number,
    grIndexEmp: number,
    empIndex: number
  ) {
    return groupList[grIndexEmp].employees[empIndex].empStations.findIndex(
      (item: { grID3: number; stations: Station[] }) => item.grID3 == grID
    );
  }

  async getNewEmpID(grID: number) {
    let groupArray = await this.getGList();
    const index = await this.getGroupIndexByGroupID(grID);
    const L = groupArray[index].employees.length;
    let nextID = L;
    let tryId = nextID;
    let idExists = false;
    let foundNext = false;

    while (!foundNext) {
      for (let i = 0; i < L; i++) {
        let EmpItem = groupArray[index].employees[i];
        if (EmpItem.id == tryId) {
          idExists = true;
          break;
        }
      }
      if (idExists) {
        nextID++;
        tryId = nextID;
        idExists = false;
      } else {
        foundNext = true;
        return tryId;
      }
    }
    return;
  }

  async getEmployeeStations() {
    const groupArray = await this.getGList();
    const empStats: any[] = [];
    for (let i = 0; i < groupArray.length; i++) {
      empStats.push({ grID3: groupArray[i].grID1, stations: [] });

      for (let j = 0; j < groupArray[i].stations.length; j++) {
        let l = empStats.length - 1;
        const name: string = groupArray[i].stations[j].name;
        const stationID: number = groupArray[i].stations[j].stationID;
        const groupID: number = groupArray[i].stations[j].grID;
        const status = false;
        empStats[l].stations.push({
          name: name,
          stationID: stationID,
          groupID: groupID,
          status: status,
        });
      }
    }
    return empStats;
  }

  async addEmployee(newEmp: Employee, grID1: number) {
    let groupArray = await this.getGList();
    const index = await this.getGroupIndexByGroupID(grID1);
    groupArray[index].employees.push(newEmp);

    //Speichere das neue GroupArray mit dem Schlüssel für das GroupArray
    this.setStorage('groups', groupArray);
  }

  async deleteEmployee(empID: number, grID1: number, grID2: number) {
    let groupArray = await this.getGList();
    const groupIndex = await this.getGroupIndexByGroupID(grID1);

    const IndexEmp = await this.getEmployeeIndexByID(
      empID,
      grID2,
      grID1,
      groupArray
    );

    groupArray[groupIndex].employees.splice(IndexEmp, 1);

    await this.setStorage('groups', groupArray);
  }

  async getEmployeeIndexByID(
    empID: number,
    grID2: number,
    grID1: number,
    groupArray: Group[]
  ) {
    const grIndex = await this.getGroupIndexByGroupID(grID1);

    const R = groupArray[grIndex].employees.findIndex(
      (item: any) => item.id === empID && item.grID2 === grID2
    );
    return R;
  }

  async getNewStatID(grID1: number) {
    let groupArray = await this.getGList();
    const index = await this.getGroupIndexByGroupID(grID1);
    const L = groupArray[index].stations.length;
    let nextID = L;
    let tryId = nextID;
    let idExists = false;
    let foundNext = false;

    while (!foundNext) {
      for (let i = 0; i < L; i++) {
        let statItem = groupArray[index].stations[i];
        if (statItem.stationID == tryId) {
          idExists = true;
          break;
        }
      }
      if (idExists) {
        nextID++;
        tryId = nextID;
        idExists = false;
      } else {
        foundNext = true;
        return tryId;
      }
    }
    return;
  }

  async addStation(newStat: Station, grID1: number) {
    const addStationInEmployees = async (stat: Station) => {
      for (let i = 0; i < groupArray.length; i++) {
        for (let j = 0; j < groupArray[i].employees.length; j++) {
          const id = stat.stationID;
          const name = stat.name;
          const grID = stat.grID;

          const empStatIndex = await this.getEmployeeStationsIndex(
            groupArray,
            grID1,
            i,
            j
          );

          groupArray[i].employees[j].empStations[empStatIndex].stations.push({
            name: name,
            stationID: id,
            grID: grID,
            status: false,
          });
        }
      }
    };
    let groupArray = await this.getGList();
    const index = await this.getGroupIndexByGroupID(grID1);
    groupArray[index].stations.push(newStat);

    //Füge die Station jedem employee in empStations jeder Gruppe zu
    await addStationInEmployees(newStat);
    this.setStorage('groups', groupArray);
  }

  async deleteStation(statID: number, grID1: number) {
    let groupArray = await this.getGList();
    const groupIndex = await this.getGroupIndexByGroupID(grID1);
    let IndexStat = await this.getStationIndexByID(statID, grID1, groupArray);

    groupArray[groupIndex].stations.splice(IndexStat, 1);

    const deleteStationInEmployees = async () => {
      //Entferne die Stat aus allen employees in allen Groups
      for (let i = 0; i < groupArray.length; i++) {
        const grID = groupArray[i].grID1;
        for (let j = 0; j < groupArray[i].employees.length; j++) {
          const empStatIndex = await this.getEmployeeStationsIndex(
            groupArray,
            grID1,
            i,
            j
          );
          const stationsIndex = groupArray[i].employees[j].empStations[
            empStatIndex
          ].stations.findIndex((item: any) => item.stationID == statID);

          groupArray[i].employees[j].empStations[empStatIndex].stations.splice(
            stationsIndex,
            1
          );
        }
      }
      await this.setStorage('groups', groupArray);
    };
    await deleteStationInEmployees();
    this.updatedEmployeeList.emit(groupArray);
    await this.setStorage('groups', groupArray);
  }

  async getStationIndexByID(stID: number, grID: number, groupArray: Group[]) {
    let grIndex = await this.getGroupIndexByGroupID(grID);
    let R = groupArray[grIndex].stations.findIndex(
      (item: any) => item.stationID === stID
    );
    return R;
  }

  async collectActiveEmps(grID1: number) {
    let collectedEmps: Employee[] = [];
    let GroupList: Group[] = await this.getGList();
    for (let i = 0; i < GroupList.length; i++) {
      for (let j = 0; j < GroupList[i].employees.length; j++) {
        if (GroupList[i].employees[j].activeGroup == grID1) {
          collectedEmps.push(GroupList[i].employees[j]);
        }
      }
    }
    return collectedEmps;
  }

  async fetchChatId(apiKey: string): Promise<number> {
    console.log(`fetching: https://api.telegram.org/bot${apiKey}/getUpdates`);
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${apiKey}/getUpdates`
      );
      const data = await res.json();
      console.log('Die Daten sind: ', data);
      const chatId = data.result?.[0]?.message?.chat?.id;
      return chatId || 0;
    } catch (err) {
      console.error('Fehler beim Abrufen der Chat-ID:', err);
      return 0;
    }
  }

  async getChatIds(assignedEmployees: Employee[]) {
    console.log('getting the ids');

    for (const emp of assignedEmployees) {
      if (emp.chat_id === 0) {
        emp.chat_id = await this.fetchChatId(emp.api_key);
        console.log('Die Chat ID ist: ', emp.chat_id);
      }
    }
  }

  async sendTelegramMessages(employee_station_pairs: any[]) {
    console.log('test send message');
    for (const pair of employee_station_pairs) {
      const emp = pair.emp;
      const assigned = pair.assigned;

      console.log('die emp api key ist: ', emp.api_key);
      console.log('die emp chat id ist: ', emp.chat_id);
      console.log("assigned: ", JSON.parse(JSON.stringify(assigned)));
      if (emp.chat_id && emp.chat_id !== 0) {
        const message =
          `Hello ${emp.name},\n\nYou are assigned to the following workstations:\n` +
          assigned.map((a: any) => `- Round ${a.round}: ${a.station.name} in Group: ${a.station_group_name}`).join('\n') + `\n\nGood Luck!`;
        console.log('die message sollte sein: ', message);
        console.log('die emp name ist: ', emp.name);
        try {
          await fetch(
            `https://api.telegram.org/bot${emp.api_key}/sendMessage`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: emp.chat_id,
                text: message,
              }),
            }
          );
        } catch (error) {
          console.error(
            `Fehler beim Senden der Nachricht an ${emp.name}:`,
            error
          );
        }
      }
    }
  }

  async getEmployeeStationPairs(matrix: any[], groups: Group[]) {
    const seen = new Map();

    for (const group of matrix) {
      const station = group[0];
      const employees = group.slice(1);
      const groupIndex = await this.getGroupIndexByGroupID(station.grID);

      employees.forEach((emp: any, index: number) => {
        if (emp.id !== undefined && emp.grID2 !== undefined) {
          const key = `${emp.id}-${emp.grID2}`;
          const assignment = {
            round: index + 1,
            station,
            station_group_name: groups[groupIndex].name,
          };

          if (!seen.has(key)) {
            seen.set(key, {
              emp: emp,
              assigned: [assignment],
            });
          } else {
            seen.get(key).assigned.push(assignment);
          }
        }
      });
    }

    for (const entry of seen.values()) {
      entry.assigned.sort((a: any, b: any) => a.round - b.round);
    }

    return Array.from(seen.values());
  }
}
