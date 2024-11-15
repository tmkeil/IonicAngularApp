export var groupList: any[] = [
    {
        name: 'Group1',
        grID1: 1,
        employees: [
            {
                name: 'Anna',
                id: 1,
                avail: true,
                grID2: 1,
                empStations: [
                    {
                        grID3: 1,
                        stations: [
                            { name: 'st1_1', stationID: 1, grID: 1, status: true },
                            { name: 'st1_2', stationID: 2, grID: 1, status: true },
                            { name: 'st1_3', stationID: 3, grID: 1, status: true },
                        ]
                    },
                    {
                        grID3: 2,
                        stations: [
                            { name: 'st2_1', stationID: 4, grID: 2, status: true },
                            { name: 'st2_2', stationID: 5, grID: 2, status: true },
                            { name: 'st2_3', stationID: 6, grID: 2, status: true },
                        ]
                    },
                ]
            },
            {
                name: 'Fara',
                id: 2,
                avail: true,
                grID2: 1,
                empStations: [
                    {
                        grID3: 1,
                        stations: [
                            { name: 'st1_1', stationID: 1, grID: 1, status: true },
                            { name: 'st1_2', stationID: 2, grID: 1, status: true },
                            { name: 'st1_3', stationID: 3, grID: 1, status: true },
                        ]
                    },
                    {
                        grID3: 2,
                        stations: [
                            { name: 'st2_1', stationID: 4, grID: 2, status: true },
                            { name: 'st2_2', stationID: 5, grID: 2, status: true },
                            { name: 'st2_3', stationID: 6, grID: 2, status: true },
                        ]
                    },
                ]
            },
            {
                name: 'Fu',
                id: 3,
                avail: true,
                grID2: 1, // Employee gehört zur eigenen Gruppe
                empStations: [
                    {
                        grID3: 1,
                        stations: [
                            { name: 'st1_1', stationID: 1, grID: 1, status: true },
                            { name: 'st1_2', stationID: 2, grID: 1, status: true },
                            { name: 'st1_3', stationID: 3, grID: 1, status: true },
                        ]
                    },
                    {
                        grID3: 2,
                        stations: [
                            { name: 'st2_1', stationID: 4, grID: 2, status: true },
                            { name: 'st2_2', stationID: 5, grID: 2, status: true },
                            { name: 'st2_3', stationID: 6, grID: 2, status: true },
                        ]
                    },
                ]
            },
            // Weitere Mitarbeiter für Gruppe 1 können hier hinzugefügt werden
        ],
        stations: [
            { name: 'st1_1', stationID: 1, grID: 1 },
            { name: 'st1_2', stationID: 2, grID: 1 },
            { name: 'st1_3', stationID: 3, grID: 1 },
        ],
        assign: false,
    },
    {
        name: 'Group2',
        grID1: 2,
        employees: [
            {
                name: 'Employee2_1',
                id: 4,
                avail: true,
                grID2: 2, // Employee gehört zur eigenen Gruppe
                empStations: [
                    {
                        grID3: 1,
                        stations: [
                            { name: 'st1_1', stationID: 1, grID: 1, status: true },
                            { name: 'st1_2', stationID: 2, grID: 1, status: false },
                            { name: 'st1_3', stationID: 3, grID: 1, status: false },
                        ]
                    },
                    {
                        grID3: 2,
                        stations: [
                            { name: 'st2_1', stationID: 4, grID: 2, status: true },
                            { name: 'st2_2', stationID: 5, grID: 2, status: true },
                            { name: 'st2_3', stationID: 6, grID: 2, status: true },
                        ]
                    },
                ]
            },
            {
                name: 'Employee2_2',
                id: 5,
                avail: true,
                grID2: 2, // Employee gehört zur eigenen Gruppe
                empStations: [
                    {
                        grID3: 1,
                        stations: [
                            { name: 'st1_1', stationID: 1, grID: 1, status: true },
                            { name: 'st1_2', stationID: 2, grID: 1, status: false },
                            { name: 'st1_3', stationID: 3, grID: 1, status: false },
                        ]
                    },
                    {
                        grID3: 2,
                        stations: [
                            { name: 'st2_1', stationID: 4, grID: 2, status: true },
                            { name: 'st2_2', stationID: 5, grID: 2, status: true },
                            { name: 'st2_3', stationID: 6, grID: 2, status: true },
                        ]
                    },
                ]
            },
            {
                name: 'Employee2_3 difvbEmployee2_3 difvbEmployee2_3 difvbEmployee2_3 difvb',
                id: 6,
                avail: true,
                grID2: 2, // Employee gehört zur eigenen Gruppe
                empStations: [
                    {
                        grID3: 1,
                        stations: [
                            { name: 'st1_1', stationID: 1, grID: 1, status: true },
                            { name: 'st1_2', stationID: 2, grID: 1, status: false },
                            { name: 'st1_3', stationID: 3, grID: 1, status: false },
                        ]
                    },
                    {
                        grID3: 2,
                        stations: [
                            { name: 'st2_1', stationID: 4, grID: 2, status: true },
                            { name: 'st2_2', stationID: 5, grID: 2, status: true },
                            { name: 'st2_3', stationID: 6, grID: 2, status: true },
                        ]
                    },
                ]
            },
            // Weitere Mitarbeiter für Gruppe 2 können hier hinzugefügt werden
        ],
        stations: [
            { name: 'st2_1', stationID: 4, grID: 2 },
            { name: 'st2_2', stationID: 5, grID: 2 },
            { name: 'st2_3', stationID: 6, grID: 2 },
        ],
        assign: false,
    }
];

var List = [
  {
    groupName: "Group1"
  },
  {

  }
]
