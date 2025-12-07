import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useEmployeeStore = defineStore("employees", () => {
  const employees = ref([
    {
      id: 1,
      name: "Fərid Məmmədov",
      position: "pmoDirector",
      department: "PMO",
      email: "ferid.mammadov@company.az",
      phone: "+994 50 123 45 67",
      avatar: null,
      managerId: null,
      responsibilities: [
        "PMO strategiyasının müəyyənləşdirilməsi",
        "Layihə portfelinin idarə edilməsi",
        "Resursların planlaşdırılması",
        "Rəhbərliyə hesabat",
      ],
      responsibilitiesEn: [
        "Define PMO strategy",
        "Manage project portfolio",
        "Resource planning",
        "Executive reporting",
      ],
      color: "#1e40af",
    },
    {
      id: 2,
      name: "Əli Həsənov",
      position: "projectManager",
      department: "PMO",
      email: "ali.hasanov@company.az",
      phone: "+994 50 234 56 78",
      avatar: null,
      managerId: 1,
      responsibilities: [
        "ERP və Data Mərkəzi layihələrinin idarəsi",
        "Komanda koordinasiyası",
        "Risk idarəetməsi",
        "Müştəri əlaqələri",
      ],
      responsibilitiesEn: [
        "Manage ERP and Data Center projects",
        "Team coordination",
        "Risk management",
        "Client relations",
      ],
      color: "#3b82f6",
    },
    {
      id: 3,
      name: "Səbinə Rəhimova",
      position: "projectManager",
      department: "PMO",
      email: "sabina.rahimova@company.az",
      phone: "+994 50 345 67 89",
      avatar: null,
      managerId: 1,
      responsibilities: [
        "Mobil tətbiq layihəsinin idarəsi",
        "Agile metodologiyası",
        "Sprint planlaması",
        "Stakeholder kommunikasiyası",
      ],
      responsibilitiesEn: [
        "Manage Mobile App project",
        "Agile methodology",
        "Sprint planning",
        "Stakeholder communication",
      ],
      color: "#8b5cf6",
    },
    {
      id: 4,
      name: "Kamran Əsgərov",
      position: "projectManager",
      department: "PMO",
      email: "kamran.asgarov@company.az",
      phone: "+994 50 456 78 90",
      avatar: null,
      managerId: 1,
      responsibilities: [
        "Web layihələrin idarəsi",
        "UX strategiyası",
        "Keyfiyyət təminatı",
      ],
      responsibilitiesEn: [
        "Manage Web projects",
        "UX strategy",
        "Quality assurance",
      ],
      color: "#22c55e",
    },
    {
      id: 5,
      name: "Nigar Məmmədova",
      position: "teamLead",
      department: "Development",
      email: "nigar.mammadova@company.az",
      phone: "+994 50 567 89 01",
      avatar: null,
      managerId: 2,
      responsibilities: [
        "Frontend komanda lideri",
        "Kod review",
        "Texniki mentorluq",
      ],
      responsibilitiesEn: [
        "Frontend team lead",
        "Code review",
        "Technical mentoring",
      ],
      color: "#ec4899",
    },
    {
      id: 6,
      name: "Rəşad Quliyev",
      position: "teamLead",
      department: "Development",
      email: "rashad.guliyev@company.az",
      phone: "+994 50 678 90 12",
      avatar: null,
      managerId: 2,
      responsibilities: [
        "Backend komanda lideri",
        "Sistem arxitekturası",
        "Database dizayn",
      ],
      responsibilitiesEn: [
        "Backend team lead",
        "System architecture",
        "Database design",
      ],
      color: "#f59e0b",
    },
    {
      id: 7,
      name: "Leyla Əliyeva",
      position: "developer",
      department: "Development",
      email: "leyla.aliyeva@company.az",
      phone: "+994 50 789 01 23",
      avatar: null,
      managerId: 5,
      responsibilities: [
        "Full-stack development",
        "API integration",
        "Unit testing",
      ],
      responsibilitiesEn: [
        "Full-stack development",
        "API integration",
        "Unit testing",
      ],
      color: "#06b6d4",
    },
    {
      id: 8,
      name: "Tural Babayev",
      position: "developer",
      department: "Development",
      email: "tural.babayev@company.az",
      phone: "+994 50 890 12 34",
      avatar: null,
      managerId: 6,
      responsibilities: [
        "Mobile development",
        "React Native",
        "App optimization",
      ],
      responsibilitiesEn: [
        "Mobile development",
        "React Native",
        "App optimization",
      ],
      color: "#84cc16",
    },
    {
      id: 9,
      name: "Günel Hüseynova",
      position: "designer",
      department: "Design",
      email: "gunel.huseynova@company.az",
      phone: "+994 50 901 23 45",
      avatar: null,
      managerId: 3,
      responsibilities: ["UI/UX dizayn", "Prototiplər", "Dizayn sistemi"],
      responsibilitiesEn: ["UI/UX design", "Prototypes", "Design system"],
      color: "#f43f5e",
    },
    {
      id: 10,
      name: "Aynur Kazımova",
      position: "analyst",
      department: "Analysis",
      email: "aynur.kazimova@company.az",
      phone: "+994 50 012 34 56",
      avatar: null,
      managerId: 4,
      responsibilities: [
        "Biznes analiz",
        "Tələblərin sənədləşdirilməsi",
        "Proses təhlili",
      ],
      responsibilitiesEn: [
        "Business analysis",
        "Requirements documentation",
        "Process analysis",
      ],
      color: "#a855f7",
    },
    {
      id: 11,
      name: "Vüsal Nəsirov",
      position: "projectManager",
      department: "PMO",
      email: "vusal.nasirov@company.az",
      phone: "+994 50 111 22 33",
      avatar: null,
      managerId: 1,
      responsibilities: [
        "Təhlükəsizlik layihələri",
        "Audit koordinasiyası",
        "Compliance",
      ],
      responsibilitiesEn: [
        "Security projects",
        "Audit coordination",
        "Compliance",
      ],
      color: "#ef4444",
    },
    {
      id: 12,
      name: "Orxan Məmmədov",
      position: "developer",
      department: "Development",
      email: "orxan.mammadov@company.az",
      phone: "+994 50 222 33 44",
      avatar: null,
      managerId: 6,
      responsibilities: ["DevOps", "CI/CD", "Cloud infrastructure"],
      responsibilitiesEn: ["DevOps", "CI/CD", "Cloud infrastructure"],
      color: "#14b8a6",
    },
    {
      id: 13,
      name: "Fidan Əliyeva",
      position: "tester",
      department: "QA",
      email: "fidan.aliyeva@company.az",
      phone: "+994 50 333 44 55",
      avatar: null,
      managerId: 11,
      responsibilities: [
        "Security testing",
        "Penetration tests",
        "Vulnerability assessment",
      ],
      responsibilitiesEn: [
        "Security testing",
        "Penetration tests",
        "Vulnerability assessment",
      ],
      color: "#64748b",
    },
  ]);

  const selectedEmployee = ref(null);
  const zoomLevel = ref(1);
  const viewMode = ref("tree"); // 'tree', 'list'

  // Computed
  const orgChartData = computed(() => {
    const root = employees.value.find((e) => e.managerId === null);
    if (!root) return null;

    function buildTree(employee) {
      const children = employees.value.filter(
        (e) => e.managerId === employee.id
      );
      return {
        ...employee,
        children: children.map(buildTree),
      };
    }

    return buildTree(root);
  });

  const employeesByPosition = computed(() => {
    const grouped = {};
    employees.value.forEach((emp) => {
      if (!grouped[emp.position]) {
        grouped[emp.position] = [];
      }
      grouped[emp.position].push(emp);
    });
    return grouped;
  });

  const employeesByDepartment = computed(() => {
    const grouped = {};
    employees.value.forEach((emp) => {
      if (!grouped[emp.department]) {
        grouped[emp.department] = [];
      }
      grouped[emp.department].push(emp);
    });
    return grouped;
  });

  const totalEmployees = computed(() => employees.value.length);

  // Actions
  function addEmployee(employee) {
    const newEmployee = {
      ...employee,
      id: Date.now(),
    };
    employees.value.push(newEmployee);
    saveToLocalStorage();
  }

  function updateEmployee(id, updates) {
    const index = employees.value.findIndex((e) => e.id === id);
    if (index > -1) {
      employees.value[index] = { ...employees.value[index], ...updates };
      saveToLocalStorage();
    }
  }

  function deleteEmployee(id) {
    // Reassign children to deleted employee's manager
    const employee = employees.value.find((e) => e.id === id);
    if (employee) {
      employees.value
        .filter((e) => e.managerId === id)
        .forEach((e) => {
          e.managerId = employee.managerId;
        });
    }

    const index = employees.value.findIndex((e) => e.id === id);
    if (index > -1) {
      employees.value.splice(index, 1);
      saveToLocalStorage();
    }
  }

  function selectEmployee(employee) {
    selectedEmployee.value = employee;
  }

  function getEmployeeById(id) {
    return employees.value.find((e) => e.id === id);
  }

  function getSubordinates(id) {
    return employees.value.filter((e) => e.managerId === id);
  }

  function zoomIn() {
    zoomLevel.value = Math.min(2, zoomLevel.value + 0.1);
  }

  function zoomOut() {
    zoomLevel.value = Math.max(0.5, zoomLevel.value - 0.1);
  }

  function resetZoom() {
    zoomLevel.value = 1;
  }

  function setViewMode(mode) {
    viewMode.value = mode;
  }

  function saveToLocalStorage() {
    localStorage.setItem("pmo_employees", JSON.stringify(employees.value));
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem("pmo_employees");
    if (saved) {
      employees.value = JSON.parse(saved);
    }
  }

  return {
    // State
    employees,
    selectedEmployee,
    zoomLevel,
    viewMode,

    // Computed
    orgChartData,
    employeesByPosition,
    employeesByDepartment,
    totalEmployees,

    // Actions
    addEmployee,
    updateEmployee,
    deleteEmployee,
    selectEmployee,
    getEmployeeById,
    getSubordinates,
    zoomIn,
    zoomOut,
    resetZoom,
    setViewMode,
    saveToLocalStorage,
    loadFromLocalStorage,
  };
});
