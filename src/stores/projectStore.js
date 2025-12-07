import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAppStore } from "./appStore";

export const useProjectStore = defineStore("projects", () => {
  const appStore = useAppStore();

  const projects = ref([
    {
      id: 1,
      name: "ERP Sistemi Tətbiqi",
      nameEn: "ERP System Implementation",
      description: "Şirkət üçün yeni ERP sisteminin qurulması və tətbiqi",
      descriptionEn: "Implementation of new ERP system for the company",
      status: "inProgress",
      priority: "high",
      progress: 65,
      startDate: "2025-01-15",
      endDate: "2025-06-30",
      budget: 150000,
      spent: 87500,
      manager: "Əli Həsənov",
      team: ["Nigar Məmmədova", "Rəşad Quliyev", "Leyla Əliyeva"],
      color: "#3b82f6",
    },
    {
      id: 2,
      name: "Mobil Tətbiq Yaradılması",
      nameEn: "Mobile App Development",
      description: "iOS və Android üçün müştəri tətbiqi",
      descriptionEn: "Customer app for iOS and Android",
      status: "planning",
      priority: "medium",
      progress: 15,
      startDate: "2025-02-01",
      endDate: "2025-08-15",
      budget: 80000,
      spent: 12000,
      manager: "Səbinə Rəhimova",
      team: ["Tural Babayev", "Günel Hüseynova"],
      color: "#8b5cf6",
    },
    {
      id: 3,
      name: "Veb Sayt Yenilənməsi",
      nameEn: "Website Redesign",
      description: "Korporativ veb saytın tam yenilənməsi",
      descriptionEn: "Complete redesign of corporate website",
      status: "completed",
      priority: "low",
      progress: 100,
      startDate: "2024-09-01",
      endDate: "2024-12-15",
      budget: 35000,
      spent: 32000,
      manager: "Kamran Əsgərov",
      team: ["Aynur Kazımova"],
      color: "#22c55e",
    },
    {
      id: 4,
      name: "Təhlükəsizlik Auditi",
      nameEn: "Security Audit",
      description: "IT infrastrukturunun təhlükəsizlik yoxlaması",
      descriptionEn: "Security assessment of IT infrastructure",
      status: "inProgress",
      priority: "critical",
      progress: 40,
      startDate: "2025-03-01",
      endDate: "2025-04-30",
      budget: 25000,
      spent: 10000,
      manager: "Vüsal Nəsirov",
      team: ["Orxan Məmmədov", "Fidan Əliyeva"],
      color: "#ef4444",
    },
    {
      id: 5,
      name: "Data Mərkəzi Modernizasiyası",
      nameEn: "Data Center Modernization",
      description: "Məlumat mərkəzinin yenilənməsi və bulud inteqrasiyası",
      descriptionEn: "Data center upgrade and cloud integration",
      status: "onHold",
      priority: "high",
      progress: 25,
      startDate: "2025-04-01",
      endDate: "2025-10-31",
      budget: 200000,
      spent: 50000,
      manager: "Əli Həsənov",
      team: ["Rəşad Quliyev", "Tural Babayev", "Orxan Məmmədov"],
      color: "#f59e0b",
    },
  ]);

  const selectedProject = ref(null);
  const filterStatus = ref("all");
  const searchQuery = ref("");
  const viewMode = ref("list"); // 'list', 'kanban', 'grid'

  // Computed
  const filteredProjects = computed(() => {
    let result = projects.value;

    // Filter by status
    if (filterStatus.value !== "all") {
      result = result.filter((p) => p.status === filterStatus.value);
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.nameEn.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.manager.toLowerCase().includes(query)
      );
    }

    return result;
  });

  const projectStats = computed(() => {
    const total = projects.value.length;
    const active = projects.value.filter(
      (p) => p.status === "inProgress"
    ).length;
    const completed = projects.value.filter(
      (p) => p.status === "completed"
    ).length;
    const delayed = projects.value.filter((p) => {
      const endDate = new Date(p.endDate);
      return endDate < new Date() && p.status !== "completed";
    }).length;
    const planning = projects.value.filter(
      (p) => p.status === "planning"
    ).length;
    const onHold = projects.value.filter((p) => p.status === "onHold").length;

    const totalBudget = projects.value.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = projects.value.reduce((sum, p) => sum + p.spent, 0);

    return {
      total,
      active,
      completed,
      delayed,
      planning,
      onHold,
      totalBudget,
      totalSpent,
      remainingBudget: totalBudget - totalSpent,
    };
  });

  const projectsByStatus = computed(() => {
    return {
      planning: projects.value.filter((p) => p.status === "planning"),
      inProgress: projects.value.filter((p) => p.status === "inProgress"),
      onHold: projects.value.filter((p) => p.status === "onHold"),
      completed: projects.value.filter((p) => p.status === "completed"),
      cancelled: projects.value.filter((p) => p.status === "cancelled"),
    };
  });

  // Actions
  function addProject(project) {
    const newProject = {
      ...project,
      id: Date.now(),
      progress: 0,
      spent: 0,
    };
    projects.value.push(newProject);
    saveToLocalStorage();
    appStore.notify("Layihə yaradıldı", "success");
  }

  function updateProject(id, updates) {
    const index = projects.value.findIndex((p) => p.id === id);
    if (index > -1) {
      projects.value[index] = { ...projects.value[index], ...updates };
      saveToLocalStorage();
      appStore.notify("Layihə yeniləndi", "success");
    }
  }

  function deleteProject(id) {
    const index = projects.value.findIndex((p) => p.id === id);
    if (index > -1) {
      projects.value.splice(index, 1);
      saveToLocalStorage();
      appStore.notify("Layihə silindi", "success");
    }
  }

  function selectProject(project) {
    selectedProject.value = project;
  }

  function updateProjectStatus(id, status) {
    updateProject(id, { status });
  }

  function setFilter(status) {
    filterStatus.value = status;
  }

  function setSearch(query) {
    searchQuery.value = query;
  }

  function setViewMode(mode) {
    viewMode.value = mode;
  }

  function saveToLocalStorage() {
    localStorage.setItem("pmo_projects", JSON.stringify(projects.value));
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem("pmo_projects");
    if (saved) {
      projects.value = JSON.parse(saved);
    }
  }

  function resetData() {
    localStorage.removeItem("pmo_projects");
    location.reload();
  }

  return {
    // State
    projects,
    selectedProject,
    filterStatus,
    searchQuery,
    viewMode,

    // Computed
    filteredProjects,
    projectStats,
    projectsByStatus,

    // Actions
    addProject,
    updateProject,
    deleteProject,
    selectProject,
    updateProjectStatus,
    setFilter,
    setSearch,
    setViewMode,
    saveToLocalStorage,
    loadFromLocalStorage,
    resetData,
  };
});
