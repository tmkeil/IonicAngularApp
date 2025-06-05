# Workforce Assignment App

An intuitive workforce management application designed to assign employees to workstations in an assembly line setting. The app ensures that no station is left unattended while providing flexibility to adapt to real-time changes.

---

## 🚀 Features

### 🧑‍🔧 Group and Station Management
- **Group Creation**:  
  Users can create groups and assign employees and stations to each group.  
- **Skill Management**:  
  Define which stations each employee can operate – within and across groups.  

### ⚙️ Assignment Automation
- **Automatic Assignments**:  
  Employees are automatically assigned to stations based on availability and skills.  
- **Selective Group Assignments**:  
  Choose which groups should be included in the assignment process.  

### 📅 Employee Availability
- **Toggle Availability**:  
  Mark employees as available or unavailable with a simple toggle.  

### 🔄 Shift Round Management
- **Swap Employees**:  
  Swap employees within a round if both can operate each other's stations.  
- **Add Unassigned Employees**:  
  Easily assign unassigned or even unavailable employees using a modal.  

### 📲 Telegram Messaging Integration
- **Automatic Telegram Notifications**:  
  After assigning employees, the app can automatically send each one a personalized Telegram message showing where they are scheduled to work.  
  This helps improve communication and ensures everyone is informed instantly.

### 🖥️ Intuitive Interface
- **Interactive Assignment Table**:  
  Real-time adjustments and a clear overview of all shifts and stations.  
- **Clean and Responsive Design**:  
  The UI adapts to mobile and desktop environments.

---

## 💡 Use Case

This app is ideal for organizations that:
- Manage rotating staff across multiple workstations (e.g. automotive production lines)
- Need a fast way to react to daily staffing changes
- Want to improve transparency and communication with their workforce

---

## ⚙️ Tech Stack

- **Ionic Framework**: For building a native-like app that runs on Android, iOS, and the Web  
- **Angular**: The core frontend framework used for structure and components  
- **TypeScript**: Strongly typed JavaScript that powers the app logic  
- **Capacitor**: Used to package the web app into native mobile apps  
- **Firebase Hosting**: For web deployment  
- **Telegram Bot API**: For sending automatic employee notifications  

---

## 🌍 Try it out

> 🔗 [Open the App in Your Browser](https://workforceassignment.firebaseapp.com)

---

## 🖼️ Screenshots

![Employee List](screenshots/7.jpg)

### 1. Group Overview Screen  
A clean homepage listing all created groups. Each group contains employees and stations for assignment.  
![Group List](screenshots/1.jpg)

### 2. Create Group Modal  
A modal dialog allows users to create a new group by providing a name and adding members and stations.  
![Create Group Modal](screenshots/2.jpg)

### 3. Save Group as JSON  
Swiping a group card to the right reveals a save icon. This exports the group data as a JSON file.  
![Save Group](screenshots/3.jpg)

### 4. Delete Group Option  
Swiping a group card to the left shows a red trash icon, allowing users to delete the group.  
![Delete Group](screenshots/5.jpg)

### 5. FAB Menu: Add or Load Group  
Tapping the floating action button reveals options to create a new group or import one from a JSON file.  
![FAB Options](screenshots/6.jpg)

### 6. Employee List in Group  
Displays all employees in a group, including cross-group employees who can work stations in this group.  
Employees are grouped by their original group name. Swiping left deletes them.  
![Employee List](screenshots/7.jpg)

### 7. Station List in Group  
Lists all workstations defined for a specific group. These are used during the assignment process.  
![Station List](screenshots/8.jpg)

### 8. Assignment Table  
The main scheduling interface showing assigned employees per round and station.  
Clicking an employee highlights them across rounds and shows valid swap options in green.  
Clicking again swaps the two employees.  
![Assignment Table](screenshots/9.jpg)

### 9. Replacement Modal  
Double-clicking an employee opens a modal showing unassigned coworkers who could replace them.  
Selecting one reassigns that employee in the current round.  
![Replacement Modal](screenshots/10.jpg)

### 10. Assignment & Telegram Options  
A modal offering two key actions: auto-assign employees to stations, and send each assigned employee their shift via Telegram.  
![Options Modal](screenshots/12.jpg)

(screenshots/1.jpg)
| Screenshot | Beschreibung |
|-----------|--------------|
| ![1](screenshots/1.jpg) | **Gruppenübersicht** – Auf dem Homescreen werden alle erstellten Gruppen übersichtlich aufgelistet. Jede Gruppe kann geöffnet, gespeichert oder gelöscht werden. |
| ![2](screenshots/2.jpg) | **Gruppe erstellen** – Ein Modal ermöglicht das Anlegen einer neuen Gruppe, in der anschließend Mitarbeiter und Stationen verwaltet werden können. |
| ![3](screenshots/3.jpg) | **Gruppe speichern** – Durch ein Wischen nach rechts auf einer Gruppenkarte erscheint ein Speichern-Button. Die Gruppe kann als JSON-Datei exportiert werden. |
| ![5](screenshots/5.jpg) | **Gruppe löschen** – Ein Wischen nach links zeigt ein rotes Papierkorb-Symbol, mit dem man die Gruppe löschen kann. |
| ![6](screenshots/6.jpg) | **Floating Action Button** – Durch Klick auf den runden Button unten rechts erscheinen Optionen zum Erstellen einer neuen Gruppe oder zum Importieren einer bestehenden JSON-Datei. |
| ![7](screenshots/7.jpg) | **Mitarbeiterliste** – Zeigt alle Mitarbeiter der Gruppe sowie externe Mitarbeiter, die mindestens eine Station in dieser Gruppe beherrschen. Mitarbeiter sind nach ihrer ursprünglichen Gruppe sortiert und lassen sich durch Wischen löschen. |
| ![8](screenshots/8.jpg) | **Stationsliste** – Übersicht über alle Stationen einer Gruppe. Diese können hinzugefügt, bearbeitet oder gelöscht werden. |
| ![9](screenshots/9.jpg) | **Zuweisungstabelle** – Zeigt, welcher Mitarbeiter an welcher Station eingeteilt ist. Durch Antippen eines Mitarbeiters werden alle Stationen markiert, an denen er arbeitet. Tauschaktionen werden visuell hervorgehoben. |
| ![10](screenshots/10.jpg) | **Mitarbeiter ersetzen** – Durch Doppelklick öffnet sich ein Modal mit verfügbaren, nicht eingeteilten Mitarbeitern, die die aktuelle Station übernehmen können. |
| ![12](screenshots/12.jpg) | **Optionen für neue Zuweisung und Telegram-Versand** – Hier kann eine neue automatische Zuweisung gestartet und Telegram-Nachrichten an die Mitarbeiter gesendet werden, um sie über ihre Stationen zu informieren. |

---

## 🧑‍💻 Author

Built with ❤️ by Me for for colleges on the assembly line at Mercedes-Benz.

