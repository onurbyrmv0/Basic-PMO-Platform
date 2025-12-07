import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCalculatorStore = defineStore("calculator", () => {
  // Budget Calculator State
  const budgetData = ref({
    laborCost: 50000,
    materialCost: 20000,
    equipmentCost: 15000,
    overheadCost: 10000,
    contingencyPercent: 10,
  });

  // Resource Calculator State
  const resourceData = ref({
    teamSize: 5,
    hourlyRate: 25,
    hoursPerDay: 8,
    workDays: 22,
    months: 6,
  });

  // ROI Calculator State
  const roiData = ref({
    investment: 100000,
    expectedReturn: 150000,
    timeframemonths: 12,
    discountRate: 10,
  });

  // Scenarios for comparison
  const scenarios = ref([
    { id: 1, name: "Ssenari 1", data: null },
    { id: 2, name: "Ssenari 2", data: null },
    { id: 3, name: "Ssenari 3", data: null },
  ]);

  const activeTab = ref("budget");

  // Budget Calculations
  const budgetCalculations = computed(() => {
    const {
      laborCost,
      materialCost,
      equipmentCost,
      overheadCost,
      contingencyPercent,
    } = budgetData.value;
    const subtotal = laborCost + materialCost + equipmentCost + overheadCost;
    const contingency = subtotal * (contingencyPercent / 100);
    const total = subtotal + contingency;

    return {
      subtotal,
      contingency,
      total,
      breakdown: [
        {
          name: "İşçi qüvvəsi",
          nameEn: "Labor",
          value: laborCost,
          percent: ((laborCost / total) * 100).toFixed(1),
        },
        {
          name: "Material",
          nameEn: "Material",
          value: materialCost,
          percent: ((materialCost / total) * 100).toFixed(1),
        },
        {
          name: "Avadanlıq",
          nameEn: "Equipment",
          value: equipmentCost,
          percent: ((equipmentCost / total) * 100).toFixed(1),
        },
        {
          name: "Əlavə xərclər",
          nameEn: "Overhead",
          value: overheadCost,
          percent: ((overheadCost / total) * 100).toFixed(1),
        },
        {
          name: "Ehtiyat",
          nameEn: "Contingency",
          value: contingency,
          percent: ((contingency / total) * 100).toFixed(1),
        },
      ],
    };
  });

  // Resource Calculations
  const resourceCalculations = computed(() => {
    const { teamSize, hourlyRate, hoursPerDay, workDays, months } =
      resourceData.value;
    const totalHoursPerMonth = teamSize * hoursPerDay * workDays;
    const totalHours = totalHoursPerMonth * months;
    const monthlyCost = totalHoursPerMonth * hourlyRate;
    const totalCost = totalHours * hourlyRate;

    return {
      totalHoursPerMonth,
      totalHours,
      monthlyCost,
      totalCost,
      costPerPerson: totalCost / teamSize,
      breakdown: {
        daily: teamSize * hoursPerDay * hourlyRate,
        weekly: teamSize * hoursPerDay * 5 * hourlyRate,
        monthly: monthlyCost,
        total: totalCost,
      },
    };
  });

  // ROI Calculations
  const roiCalculations = computed(() => {
    const { investment, expectedReturn, timeframemonths, discountRate } =
      roiData.value;
    const profit = expectedReturn - investment;
    const roi = (profit / investment) * 100;
    const monthlyReturn = profit / timeframemonths;
    const paybackPeriod = investment / monthlyReturn;

    // NPV calculation (simplified)
    const monthlyRate = discountRate / 100 / 12;
    let npv = -investment;
    const monthlyIncome = expectedReturn / timeframemonths;
    for (let i = 1; i <= timeframemonths; i++) {
      npv += monthlyIncome / Math.pow(1 + monthlyRate, i);
    }

    return {
      profit,
      roi: roi.toFixed(2),
      monthlyReturn,
      paybackPeriod: paybackPeriod.toFixed(1),
      npv: npv.toFixed(2),
      isPositiveNPV: npv > 0,
      profitability: roi > 0 ? "positive" : "negative",
    };
  });

  // Actions
  function updateBudgetData(key, value) {
    budgetData.value[key] = parseFloat(value) || 0;
  }

  function updateResourceData(key, value) {
    resourceData.value[key] = parseFloat(value) || 0;
  }

  function updateRoiData(key, value) {
    roiData.value[key] = parseFloat(value) || 0;
  }

  function resetBudget() {
    budgetData.value = {
      laborCost: 0,
      materialCost: 0,
      equipmentCost: 0,
      overheadCost: 0,
      contingencyPercent: 10,
    };
  }

  function resetResource() {
    resourceData.value = {
      teamSize: 1,
      hourlyRate: 0,
      hoursPerDay: 8,
      workDays: 22,
      months: 1,
    };
  }

  function resetRoi() {
    roiData.value = {
      investment: 0,
      expectedReturn: 0,
      timeframemonths: 12,
      discountRate: 10,
    };
  }

  function resetAll() {
    resetBudget();
    resetResource();
    resetRoi();
  }

  function setActiveTab(tab) {
    activeTab.value = tab;
  }

  function saveScenario(index, name = null) {
    scenarios.value[index] = {
      id: index + 1,
      name: name || `Ssenari ${index + 1}`,
      data: {
        budget: { ...budgetData.value },
        resource: { ...resourceData.value },
        roi: { ...roiData.value },
        results: {
          budget: budgetCalculations.value,
          resource: resourceCalculations.value,
          roi: roiCalculations.value,
        },
      },
    };
    saveToLocalStorage();
  }

  function loadScenario(index) {
    const scenario = scenarios.value[index];
    if (scenario.data) {
      budgetData.value = { ...scenario.data.budget };
      resourceData.value = { ...scenario.data.resource };
      roiData.value = { ...scenario.data.roi };
    }
  }

  function saveToLocalStorage() {
    localStorage.setItem(
      "pmo_calculator",
      JSON.stringify({
        budget: budgetData.value,
        resource: resourceData.value,
        roi: roiData.value,
        scenarios: scenarios.value,
      })
    );
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem("pmo_calculator");
    if (saved) {
      const data = JSON.parse(saved);
      if (data.budget) budgetData.value = data.budget;
      if (data.resource) resourceData.value = data.resource;
      if (data.roi) roiData.value = data.roi;
      if (data.scenarios) scenarios.value = data.scenarios;
    }
  }

  return {
    // State
    budgetData,
    resourceData,
    roiData,
    scenarios,
    activeTab,

    // Computed
    budgetCalculations,
    resourceCalculations,
    roiCalculations,

    // Actions
    updateBudgetData,
    updateResourceData,
    updateRoiData,
    resetBudget,
    resetResource,
    resetRoi,
    resetAll,
    setActiveTab,
    saveScenario,
    loadScenario,
    saveToLocalStorage,
    loadFromLocalStorage,
  };
});
