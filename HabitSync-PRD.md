# 🧾 HabitSync – Project Requirements Document (Tabular Format)

> 📁 File format: `HabitSync-PRD.md`  
> Structure: **Epics → Features → Descriptions → Notes**

---

## 📚 EPIC: Core Habit Tracking

| **Feature** | **Description** | **Notes** |
|-------------|------------------|-----------|
| Add Habit | Users can add a new habit | Customizable color, icon, type, frequency |
| Track Habit | Log completion (binary or numeric) | Add optional note and time of day |
| Default Habits | Suggest pre-made habits | Can be overridden or deleted |
| Habit Types | Binary (Yes/No), Numeric (e.g., meters walked) | Used to determine input method |
| Habit Frequency | Custom repeat patterns | Daily, every X days, X times per week/month, specific days |
| Priority Levels | Set priority per habit | None, Low, Medium, High, Critical |
| Habit Notes | Add notes for specific habit logs | Attached to daily log, not habit itself |
| Habit Color & Icon | Choose visual representation | Enhances visual sorting |

---

## 🧭 EPIC: Visualization

| **Feature** | **Description** | **Notes** |
|-------------|------------------|-----------|
| GitHub-style Tracker | Display habit logs in contribution-style heatmap | Color intensity based on completion |
| Calendar View | Visualize habits on a calendar | Toggle per habit |
| Habit Stats | View progress, streaks, completion | Not MVP, but track days since first usage |

---

## 🗃 EPIC: Categorization & Customization

| **Feature** | **Description** | **Notes** |
|-------------|------------------|-----------|
| Categories | Assign habits to categories | User-defined & default ones (Health, Productivity, etc.) |
| Custom Categories | Users can create/manage own | Editable, deletable |

---

## 🔔 EPIC: Notifications & Reminders

| **Feature** | **Description** | **Notes** |
|-------------|------------------|-----------|
| Habit Reminders | Per habit, recurring | Daily, Weekly, Custom |
| Start of Day Summary | Daily summary of planned habits | Notification or dashboard |
| Collaborative Alerts | Get notified on shared habit changes | Via push notification |
| Task/To-Do Reminders | Set alerts for To-Do tasks | Recurring or one-time |

---

## 🤝 EPIC: Collaborative Features

| **Feature** | **Description** | **Notes** |
|-------------|------------------|-----------|
| Shared Habits | Co-track habits with someone | Sync both sides |
| Collaborative To-Do | Shared to-do lists | For couples, roommates, teams |
| Collaborative Shopping | Shared grocery lists | Real-time update after refresh |
| Notifications | Notify user of shared updates | Needs FCM or similar |

---

## 📝 EPIC: Journal & Notes

| **Feature** | **Description** | **Notes** |
|-------------|------------------|-----------|
| Daily Journal | Add general thoughts | One or more per day |
| Attach Notes to Logs | Add to specific habit entry | Markdown optional |

---

## ✅ EPIC: To-Do List

| **Feature** | **Description** | **Notes** |
|-------------|------------------|-----------|
| Daily To-Do | Track one-off or recurring tasks | Categorize by time of day |
| Priority | Mark urgency | Same scale as habits |
| Collaboration | Share tasks | Sync with partner |

---

## 🛒 EPIC: Shopping List

| **Feature** | **Description** | **Notes** |
|-------------|------------------|-----------|
| Shared Lists | Collaborate in real time | Needs refresh to sync |
| Tick Items | Check off completed purchases | State sync between users |

---

## 🧑‍🎨 EPIC: UI/UX & Theming

| **Feature** | **Description** | **Notes** |
|-------------|------------------|-----------|
| Dark/Light Themes | Easily switchable themes | Use global theme variables |
| Navigation | Bottom tabs, drawers, modals | Logical screen grouping |
| Modern Design | Mobile-first, intuitive UX | Use of icons, touch feedback, shadows |
| Date & Logo | Display on dashboard | Top of HomeScreen |

---

## ☁️ EPIC: Offline & Sync

| **Feature** | **Description** | **Notes** |
|-------------|------------------|-----------|
| Offline Support | Use app without internet | Store data locally |
| Premium Sync | Sync data to cloud | For premium users only |
| Local DB Choice | Use WatermelonDB | Lightweight, offline-first |
| Data Backup | Sync on reconnect | Collaborative sync included |

---

## 🛠️ EPIC: Tech Stack & Architecture

| **Component** | **Description** | **Justification / Notes** |
|---------------|------------------|---------------------------|
| Mobile Framework | React Native + Expo | Cross-platform, fast dev |
| Navigation | React Navigation | Tabs, Drawer, Modals |
| State Management | Redux Toolkit & React Context | Context for UI; Redux for logic/data |
| Local Storage | WatermelonDB | Offline support |
| Notifications | Expo Notifications | Local & push notifications |
| Backend | Node.js + NestJS | Modular, scalable |
| Backend ORM | Prisma | With schema migrations |
| Database | PostgreSQL | Structured, reliable |
| Auth | JWT | Standard for mobile apps |
| Sync | REST + WebSockets (future) | Start with polling or refresh model |

---

## ⛔ Out of Scope (For Future Release)

| **Feature** | **Description** |
|-------------|------------------|
| Habit Discovery | Make public profiles and visible habits |
| Social Feed | Encouraging messages, support |
| Achievements | Streaks, trophies |
| Motivational Content | Quotes, dashboards |
| Android Widgets | Home screen tracker |
| Journeys | 30-day guided plans |
