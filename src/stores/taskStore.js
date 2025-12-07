import { defineStore } from "pinia";
import { ref, computed } from "vue";
import dayjs from "dayjs";

export const useTaskStore = defineStore("tasks", () => {
  const tasks = ref([
    {
      id: 1,
      name: "Tələblərin toplanması",
      nameEn: "Requirements Gathering",
      projectId: 1,
      startDate: "2025-01-15",
      endDate: "2025-02-01",
      progress: 100,
      assignee: "Nigar Məmmədova",
      dependencies: [],
      color: "#3b82f6",
      milestone: false,
    },
    {
      id: 2,
      name: "Sistem dizaynı",
      nameEn: "System Design",
      projectId: 1,
      startDate: "2025-02-01",
      endDate: "2025-02-28",
      progress: 100,
      assignee: "Rəşad Quliyev",
      dependencies: [1],
      color: "#3b82f6",
      milestone: false,
    },
    {
      id: 3,
      name: "Database strukturu",
      nameEn: "Database Structure",
      projectId: 1,
      startDate: "2025-02-15",
      endDate: "2025-03-15",
      progress: 80,
      assignee: "Rəşad Quliyev",
      dependencies: [2],
      color: "#3b82f6",
      milestone: false,
    },
    {
      id: 4,
      name: "Backend inkişafı",
      nameEn: "Backend Development",
      projectId: 1,
      startDate: "2025-03-01",
      endDate: "2025-04-30",
      progress: 60,
      assignee: "Leyla Əliyeva",
      dependencies: [3],
      color: "#3b82f6",
      milestone: false,
    },
    {
      id: 5,
      name: "Frontend inkişafı",
      nameEn: "Frontend Development",
      projectId: 1,
      startDate: "2025-03-15",
      endDate: "2025-05-15",
      progress: 45,
      assignee: "Nigar Məmmədova",
      dependencies: [3],
      color: "#3b82f6",
      milestone: false,
    },
    {
      id: 6,
      name: "Alfa versiya",
      nameEn: "Alpha Release",
      projectId: 1,
      startDate: "2025-05-15",
      endDate: "2025-05-15",
      progress: 0,
      assignee: "Əli Həsənov",
      dependencies: [4, 5],
      color: "#f59e0b",
      milestone: true,
    },
    {
      id: 7,
      name: "Testləşdirmə",
      nameEn: "Testing",
      projectId: 1,
      startDate: "2025-05-16",
      endDate: "2025-06-15",
      progress: 0,
      assignee: "Leyla Əliyeva",
      dependencies: [6],
      color: "#3b82f6",
      milestone: false,
    },
    {
      id: 8,
      name: "İstifadəyə verilmə",
      nameEn: "Go Live",
      projectId: 1,
      startDate: "2025-06-30",
      endDate: "2025-06-30",
      progress: 0,
      assignee: "Əli Həsənov",
      dependencies: [7],
      color: "#22c55e",
      milestone: true,
    },
    // Mobile App Tasks
    {
      id: 9,
      name: "UI/UX Dizayn",
      nameEn: "UI/UX Design",
      projectId: 2,
      startDate: "2025-02-01",
      endDate: "2025-03-01",
      progress: 30,
      assignee: "Günel Hüseynova",
      dependencies: [],
      color: "#8b5cf6",
      milestone: false,
    },
    {
      id: 10,
      name: "Prototip hazırlanması",
      nameEn: "Prototype Development",
      projectId: 2,
      startDate: "2025-03-01",
      endDate: "2025-03-15",
      progress: 0,
      assignee: "Tural Babayev",
      dependencies: [9],
      color: "#8b5cf6",
      milestone: false,
    },
  ]);

  const selectedTask = ref(null);
  const selectedProjectId = ref(null);
  const viewScale = ref("week"); // 'day', 'week', 'month'
  const showDependencies = ref(true);
  const showCriticalPath = ref(false);

  // Computed
  const filteredTasks = computed(() => {
    if (selectedProjectId.value) {
      return tasks.value.filter((t) => t.projectId === selectedProjectId.value);
    }
    return tasks.value;
  });

  const tasksByProject = computed(() => {
    const grouped = {};
    tasks.value.forEach((task) => {
      if (!grouped[task.projectId]) {
        grouped[task.projectId] = [];
      }
      grouped[task.projectId].push(task);
    });
    return grouped;
  });

  const timelineRange = computed(() => {
    if (filteredTasks.value.length === 0) {
      return {
        start: dayjs().startOf("month"),
        end: dayjs().endOf("month"),
      };
    }

    const dates = filteredTasks.value.flatMap((t) => [
      dayjs(t.startDate),
      dayjs(t.endDate),
    ]);

    // compute min and max without relying on dayjs plugins
    let min = dates[0];
    let max = dates[0];
    for (let i = 1; i < dates.length; i++) {
      const d = dates[i];
      if (d.isBefore(min)) min = d;
      if (d.isAfter(max)) max = d;
    }

    return {
      start: min.subtract(1, "week"),
      end: max.add(1, "week"),
    };
  });

  // Actions
  function addTask(task) {
    const newTask = {
      ...task,
      id: Date.now(),
      progress: 0,
      dependencies: task.dependencies || [],
    };
    tasks.value.push(newTask);
    saveToLocalStorage();
  }

  function updateTask(id, updates) {
    const index = tasks.value.findIndex((t) => t.id === id);
    if (index > -1) {
      tasks.value[index] = { ...tasks.value[index], ...updates };
      saveToLocalStorage();
    }
  }

  function deleteTask(id) {
    const index = tasks.value.findIndex((t) => t.id === id);
    if (index > -1) {
      tasks.value.splice(index, 1);
      // Remove dependencies to this task
      tasks.value.forEach((t) => {
        t.dependencies = t.dependencies.filter((d) => d !== id);
      });
      saveToLocalStorage();
    }
  }

  function selectTask(task) {
    selectedTask.value = task;
  }

  function setProjectFilter(projectId) {
    selectedProjectId.value = projectId;
  }

  function setViewScale(scale) {
    viewScale.value = scale;
  }

  function toggleDependencies() {
    showDependencies.value = !showDependencies.value;
  }

  function toggleCriticalPath() {
    showCriticalPath.value = !showCriticalPath.value;
  }

  function updateTaskDates(id, startDate, endDate) {
    updateTask(id, { startDate, endDate });
  }

  function updateTaskProgress(id, progress) {
    updateTask(id, { progress: Math.min(100, Math.max(0, progress)) });
  }

  function addDependency(taskId, dependencyId) {
    const task = tasks.value.find((t) => t.id === taskId);
    if (task && !task.dependencies.includes(dependencyId)) {
      task.dependencies.push(dependencyId);
      saveToLocalStorage();
    }
  }

  function removeDependency(taskId, dependencyId) {
    const task = tasks.value.find((t) => t.id === taskId);
    if (task) {
      task.dependencies = task.dependencies.filter((d) => d !== dependencyId);
      saveToLocalStorage();
    }
  }

  function getTaskDuration(task) {
    return dayjs(task.endDate).diff(dayjs(task.startDate), "day") + 1;
  }

  function saveToLocalStorage() {
    localStorage.setItem("pmo_tasks", JSON.stringify(tasks.value));
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem("pmo_tasks");
    if (saved) {
      tasks.value = JSON.parse(saved);
    }
  }

  return {
    // State
    tasks,
    selectedTask,
    selectedProjectId,
    viewScale,
    showDependencies,
    showCriticalPath,

    // Computed
    filteredTasks,
    tasksByProject,
    timelineRange,

    // Actions
    addTask,
    updateTask,
    deleteTask,
    selectTask,
    setProjectFilter,
    setViewScale,
    toggleDependencies,
    toggleCriticalPath,
    updateTaskDates,
    updateTaskProgress,
    addDependency,
    removeDependency,
    getTaskDuration,
    saveToLocalStorage,
    loadFromLocalStorage,
  };
});
