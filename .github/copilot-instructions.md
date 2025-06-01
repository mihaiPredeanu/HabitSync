# 🤖 HabitSync – AI Copilot Instructions

This document provides structured instructions to an AI Copilot (e.g., autonomous AI agent or GPT-based agent) to build and iterate on the **HabitSync React Native App**. This includes architectural expectations, core feature list, UI components, backend setup, and integration principles.

---

## 📱 Project Overview

**Name:** HabitSync  
**Type:** Mobile Application  
**Platform:** React Native with Expo  
**Architecture:** Modular with Redux Toolkit, React Context, and clean code principles (SOLID)  
**Scope:** Offline-capable, habit tracker app with collaborative features, to-do and shopping lists, and customizable notifications.

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React Native (Expo) |
| **State Management** | Redux Toolkit + React Context |
| **Navigation** | React Navigation (Drawer, Bottom Tabs, Modals) |
| **Notifications** | Expo Notifications (Push + Local) |
| **Storage** | WatermelonDB (for offline-first support) |
| **Backend** | Node.js with NestJS |
| **ORM** | Prisma |
| **Database** | PostgreSQL |
| **Auth** | JWT-based |
| **Sync** | REST + Polling (Realtime via WebSockets in future) |

---

## 🔨 Development Guidelines

- Follow **SOLID principles** and component-based architecture
- Use **TypeScript** across frontend and backend
- Maintain a **feature-first folder structure**
- Define **interfaces/types** for habits, users, categories, etc.
- Apply **responsive and accessible design** best practices
- Maintain separate **theme files** for dark/light modes

---

## 🧱 Core Modules & Features

### 🎯 Habit Tracking
- Add habits (custom or from default templates)
- Track with:
  - Yes/No (binary)
  - Measurable inputs (e.g., steps, minutes)
- Customize:
  - Frequency: Daily, Every X Days, X Times per Week/Month, Specific Days
  - Priority: None, Low, Medium, High, Critical
  - Time of day: Morning, Afternoon, Evening
  - Icons & Color
- Notes per log entry
- GitHub-style and calendar visualizations
- Journal per day

### 📚 Categories
- Default: Health, Productivity, Learning etc.
- Custom: User-defined and manageable

### 🔔 Notifications
- Set per habit/task
- Frequency: Daily, Weekly, Custom
- Day Start Summary
- Collaborative updates trigger alerts

### 🤝 Collaboration
- Shared Habits
- Shared To-Do List
- Shared Shopping List
- Notification on changes
- Real-time refresh model

### ✅ To-Do List
- Tasks for today
- Recurring or one-off
- Share with others
- Set priorities

### 🛒 Shopping List
- Create & manage lists
- Share with users
- Check items off
- Notifies on update (requires refresh)

---

## 🎨 UI/UX Expectations

- Clean, modern mobile look
- Theming:
  - Support dark/light mode
  - Use global theme variables
- Key UI Components:
  - Habit Card
  - Tracker Grid (GitHub-style)
  - Calendar view
  - Journal input
  - Navigation (Bottom Tabs, Drawer, Modal)
  - To-Do Item
  - Shopping Item
- Daily header with date and logo

---

## 🗃 Data Considerations

- Save “first day of use” for stats
- Store all data locally first (WatermelonDB)
- Sync to cloud for premium users
- Use efficient schemas (habit logs, categories, user settings, shared data)

---

## 🧪 Testing & Quality

- Unit test all reducers, services, components
- Use mock APIs for frontend dev
- Validate schema using Prisma and DTOs
- Use ESLint, Prettier, and Husky

---

## 🚫 Out of Scope (For Now)

Do not implement the following yet:
- Social feed or public habits
- Habit support messages
- 30-day journeys
- Achievements and streaks
- Quotes and dashboards
- Android widgets

---

## 🧠 AI Instructions Summary

The AI Agent should:
- Scaffold the app with Expo + TypeScript
- Generate Redux slices for habits, tasks, shopping
- Build reusable, styled components
- Set up theme provider and light/dark mode toggler
- Implement local DB layer (WatermelonDB)
- Scaffold NestJS backend with Prisma and PostgreSQL
- Use REST endpoints and provide sample calls
- Allow easy switching between offline/online
- Build collaborative modules to support shared data + notifications

---

Use the separate file `HabitSync-PRD.md` as the detailed source of feature logic and structure.
