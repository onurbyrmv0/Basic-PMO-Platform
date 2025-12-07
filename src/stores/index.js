import { createPinia } from "pinia";

const pinia = createPinia();

export default pinia;

// Export all stores
export { useAppStore } from "./appStore";
export { useProjectStore } from "./projectStore";
export { useTaskStore } from "./taskStore";
export { useEmployeeStore } from "./employeeStore";
export { useCalculatorStore } from "./calculatorStore";
