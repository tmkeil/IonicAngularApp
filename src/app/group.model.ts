export interface Station {
    name: string;
    stationID: number;
    grID: number;
    status?: boolean;
}

export interface Employee {
    name: string;
    id: number;
    avail: boolean;
    grID2: number;
    activeGroup: number;
    empStations: {
        grID3: number;
        stations: Station[];
    }[];
}

export interface Group {
    name: string;
    grID1: number;
    employees: Employee[];
    stations: Station[];
    assign: boolean;
}

export interface GroupCollection {
  grName: string;
  grID: number;
  employees: Employee[];
}
