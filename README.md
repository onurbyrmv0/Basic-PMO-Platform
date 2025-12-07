# 🏢 PMO Platform - Layihə Ofisi İdarəetmə Sistemi

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-2.x-FFD859?style=for-the-badge)

**Tam funksional layihə idarəetmə ofisi (PMO) demo platforması**

[Azərbaycan](#az) | [English](#en)

</div>

---

<a name="az"></a>

## 🇦🇿 Azərbaycan dili

### 📋 Haqqında

Bu platforma layihə idarəetmə ofisi (PMO) üçün nəzərdə tutulmuş tam funksional demo tətbiqidir. Prezentasiya və təqdimat məqsədləri üçün hazırlanmışdır.

### ✨ Xüsusiyyətlər

| Modul                     | Təsvir                                                                  |
| ------------------------- | ----------------------------------------------------------------------- |
| 📊 **İdarə Paneli**       | KPI kartları, layihə status qrafiki, büdcə icmalı, son aktivliklər      |
| 📁 **Layihələr**          | Siyahı/Kanban görünüşü, CRUD əməliyyatları, filtrlər, prioritet idarəsi |
| 📅 **Gantt Diaqramı**     | Zoom (gün/həftə/ay), tapşırıq idarəsi, asılılıqlar                      |
| 🏛️ **Təşkilati Struktur** | İnteraktiv org-chart, işçi idarəsi, iyerarxiya                          |
| 🧮 **Kalkulyator**        | Büdcə hesablaması, resurs planlaması, ROI/NPV analizi                   |
| 🔄 **İş Prosesi**         | 5 mərhələli PMO prosesi, interaktiv checklist                           |
| ⚙️ **Tənzimləmələr**      | Dil, tema, export, klaviatura qısayolları                               |

### 🌐 Dil Dəstəyi

- 🇦🇿 Azərbaycan dili
- 🇺🇸 English

### 🎨 Tema

- ☀️ İşıqlı rejim (Light Mode)
- 🌙 Qaranlıq rejim (Dark Mode)

### 📤 Export Formatları

- 📄 PDF
- 📊 Excel (XLSX)
- 🖼️ PNG

### 🚀 Quraşdırma

```bash
# Layihəni klonlayın
git clone <repo-url>
cd Layihe_ofisi

# Asılılıqları quraşdırın
npm install

# Development server-i başladın
npm run dev

# Production build
npm run build
```

### 📁 Layihə Strukturu

```
src/
├── assets/
│   └── styles/
│       └── main.css          # Tailwind və xüsusi stillər
├── components/
│   ├── calculator/           # Kalkulyator komponentləri
│   ├── common/               # Ümumi komponentlər
│   ├── dashboard/            # Dashboard komponentləri
│   ├── gantt/                # Gantt diaqram komponentləri
│   ├── layout/               # Layout komponentləri
│   ├── orgchart/             # Təşkilati struktur
│   └── projects/             # Layihə komponentləri
├── composables/
│   └── useExport.js          # Export funksiyaları
├── i18n/
│   ├── az.json               # Azərbaycan dili
│   ├── en.json               # İngilis dili
│   └── index.js              # i18n konfiqurasiyası
├── router/
│   └── index.js              # Vue Router
├── stores/
│   ├── appStore.js           # Tətbiq state
│   ├── calculatorStore.js    # Kalkulyator state
│   ├── employeeStore.js      # İşçi state
│   ├── projectStore.js       # Layihə state
│   └── taskStore.js          # Tapşırıq state
├── views/
│   ├── CalculatorView.vue    # Kalkulyator səhifəsi
│   ├── DashboardView.vue     # İdarə paneli
│   ├── GanttView.vue         # Gantt diaqramı
│   ├── OrgChartView.vue      # Təşkilati struktur
│   ├── ProjectsView.vue      # Layihələr
│   ├── SettingsView.vue      # Tənzimləmələr
│   └── WorkflowView.vue      # İş prosesi
├── App.vue                   # Əsas komponent
└── main.js                   # Giriş nöqtəsi
```

---

<a name="en"></a>

## 🇺🇸 English

### 📋 About

This platform is a fully functional demo application designed for Project Management Office (PMO). It is prepared for presentation and demonstration purposes.

### ✨ Features

| Module             | Description                                                         |
| ------------------ | ------------------------------------------------------------------- |
| 📊 **Dashboard**   | KPI cards, project status chart, budget overview, recent activities |
| 📁 **Projects**    | List/Kanban view, CRUD operations, filters, priority management     |
| 📅 **Gantt Chart** | Zoom (day/week/month), task management, dependencies                |
| 🏛️ **Org Chart**   | Interactive organization chart, employee management, hierarchy      |
| 🧮 **Calculator**  | Budget calculation, resource planning, ROI/NPV analysis             |
| 🔄 **Workflow**    | 5-stage PMO process, interactive checklist                          |
| ⚙️ **Settings**    | Language, theme, export, keyboard shortcuts                         |

### 🌐 Language Support

- 🇦🇿 Azerbaijani
- 🇺🇸 English

### 🎨 Themes

- ☀️ Light Mode
- 🌙 Dark Mode

### 📤 Export Formats

- 📄 PDF
- 📊 Excel (XLSX)
- 🖼️ PNG

### 🚀 Installation

```bash
# Clone the project
git clone <repo-url>
cd Layihe_ofisi

# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build
```

### 🛠️ Tech Stack

| Technology   | Purpose                              |
| ------------ | ------------------------------------ |
| Vue 3        | Frontend framework (Composition API) |
| Vite         | Build tool & dev server              |
| Tailwind CSS | Utility-first CSS framework          |
| Pinia        | State management                     |
| Vue Router   | SPA routing                          |
| Vue I18n     | Internationalization                 |
| Chart.js     | Data visualization                   |
| jsPDF        | PDF export                           |
| XLSX         | Excel export                         |
| html2canvas  | Image export                         |

### 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 📄 License

MIT License - Bu layihəni sərbəst istifadə edə bilərsiniz.

---

<div align="center">

**Hazırladı: Onur Bayramov**

🏢 Layihə İdarəetmə Ofisi üçün Demo Tətbiqi

</div>
