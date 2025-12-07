import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: () => import("../views/DashboardView.vue"),
    meta: { title: "dashboard.title" },
  },
  {
    path: "/projects",
    name: "Projects",
    component: () => import("../views/ProjectsView.vue"),
    meta: { title: "projects.title" },
  },
  {
    path: "/gantt",
    name: "Gantt",
    component: () => import("../views/GanttView.vue"),
    meta: { title: "gantt.title" },
  },
  {
    path: "/orgchart",
    name: "OrgChart",
    component: () => import("../views/OrgChartView.vue"),
    meta: { title: "orgchart.title" },
  },
  {
    path: "/calculator",
    name: "Calculator",
    component: () => import("../views/CalculatorView.vue"),
    meta: { title: "calculator.title" },
  },
  {
    path: "/workflow",
    name: "Workflow",
    component: () => import("../views/WorkflowView.vue"),
    meta: { title: "workflow.title" },
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/SettingsView.vue"),
    meta: { title: "settings.title" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFoundView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
