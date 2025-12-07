import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useAppStore = defineStore("app", () => {
  // Theme
  const isDark = ref(false);
  const colorScheme = ref("blue");

  // Sidebar
  const sidebarOpen = ref(true);
  const sidebarCollapsed = ref(false);

  // Loading
  const isLoading = ref(false);

  // Notifications
  const notifications = ref([]);

  // Initialize theme from localStorage or system preference
  function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved) {
      isDark.value = saved === "dark";
    } else {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    applyTheme();
  }

  function applyTheme() {
    if (isDark.value) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  function toggleTheme() {
    isDark.value = !isDark.value;
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
    applyTheme();
  }

  function setTheme(theme) {
    if (theme === "system") {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
      localStorage.removeItem("theme");
    } else {
      isDark.value = theme === "dark";
      localStorage.setItem("theme", theme);
    }
    applyTheme();
  }

  // Color scheme
  function setColorScheme(scheme) {
    colorScheme.value = scheme;
    localStorage.setItem("colorScheme", scheme);
    document.documentElement.setAttribute("data-color-scheme", scheme);
  }

  function initColorScheme() {
    const saved = localStorage.getItem("colorScheme");
    if (saved) {
      colorScheme.value = saved;
      document.documentElement.setAttribute("data-color-scheme", saved);
    }
  }

  // Sidebar
  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
  }

  function collapseSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }

  // Notifications
  function addNotification(notification) {
    const id = Date.now();
    notifications.value.push({
      id,
      ...notification,
      timestamp: new Date(),
    });

    // Auto remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  }

  function notify(message, type = "info", duration = 5000) {
    addNotification({ message, type, duration });
  }

  // Loading
  function setLoading(value) {
    isLoading.value = value;
  }

  return {
    // State
    isDark,
    colorScheme,
    sidebarOpen,
    sidebarCollapsed,
    isLoading,
    notifications,

    // Actions
    initTheme,
    toggleTheme,
    setTheme,
    setColorScheme,
    initColorScheme,
    toggleSidebar,
    collapseSidebar,
    addNotification,
    removeNotification,
    notify,
    setLoading,
  };
});
