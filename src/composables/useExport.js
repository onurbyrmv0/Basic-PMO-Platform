import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useI18n } from "vue-i18n";

export function useExport() {
  const { t, locale } = useI18n();

  /**
   * Export element to PDF
   * @param {HTMLElement|string} element - Element or selector to export
   * @param {string} filename - Output filename (without extension)
   */
  async function exportToPDF(element, filename = "export") {
    try {
      const el =
        typeof element === "string" ? document.querySelector(element) : element;

      if (!el) {
        throw new Error("Element not found");
      }

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${filename}.pdf`);

      return { success: true, message: t("export.success") };
    } catch (error) {
      console.error("PDF export error:", error);
      return { success: false, message: t("export.error") };
    }
  }

  /**
   * Export data to Excel
   * @param {Array} data - Array of objects to export
   * @param {string} filename - Output filename (without extension)
   * @param {string} sheetName - Excel sheet name
   */
  function exportToExcel(data, filename = "export", sheetName = "Sheet1") {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // Generate buffer
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `${filename}.xlsx`);

      return { success: true, message: t("export.success") };
    } catch (error) {
      console.error("Excel export error:", error);
      return { success: false, message: t("export.error") };
    }
  }

  /**
   * Export element to PNG image
   * @param {HTMLElement|string} element - Element or selector to export
   * @param {string} filename - Output filename (without extension)
   */
  async function exportToPNG(element, filename = "export") {
    try {
      const el =
        typeof element === "string" ? document.querySelector(element) : element;

      if (!el) {
        throw new Error("Element not found");
      }

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      canvas.toBlob((blob) => {
        saveAs(blob, `${filename}.png`);
      }, "image/png");

      return { success: true, message: t("export.success") };
    } catch (error) {
      console.error("PNG export error:", error);
      return { success: false, message: t("export.error") };
    }
  }

  /**
   * Export projects data to Excel
   * @param {Array} projects - Array of project objects
   */
  function exportProjectsToExcel(projects) {
    const headers =
      locale.value === "az"
        ? {
            name: "Ad",
            status: "Status",
            priority: "Prioritet",
            progress: "İrəliləyiş %",
            budget: "Büdcə",
            startDate: "Başlama",
            endDate: "Bitmə",
          }
        : {
            name: "Name",
            status: "Status",
            priority: "Priority",
            progress: "Progress %",
            budget: "Budget",
            startDate: "Start Date",
            endDate: "End Date",
          };

    const data = projects.map((p) => ({
      [headers.name]: p.name,
      [headers.status]: p.status,
      [headers.priority]: p.priority,
      [headers.progress]: p.progress,
      [headers.budget]: p.budget,
      [headers.startDate]: p.startDate,
      [headers.endDate]: p.endDate,
    }));

    return exportToExcel(
      data,
      "projects",
      locale.value === "az" ? "Layihələr" : "Projects"
    );
  }

  /**
   * Export tasks data to Excel
   * @param {Array} tasks - Array of task objects
   */
  function exportTasksToExcel(tasks) {
    const headers =
      locale.value === "az"
        ? {
            name: "Ad",
            status: "Status",
            progress: "İrəliləyiş %",
            startDate: "Başlama",
            endDate: "Bitmə",
            assignee: "Məsul",
          }
        : {
            name: "Name",
            status: "Status",
            progress: "Progress %",
            startDate: "Start Date",
            endDate: "End Date",
            assignee: "Assignee",
          };

    const data = tasks.map((t) => ({
      [headers.name]: t.name,
      [headers.status]: t.status,
      [headers.progress]: t.progress,
      [headers.startDate]: t.startDate,
      [headers.endDate]: t.endDate,
      [headers.assignee]: t.assignee,
    }));

    return exportToExcel(
      data,
      "tasks",
      locale.value === "az" ? "Tapşırıqlar" : "Tasks"
    );
  }

  /**
   * Export organization chart to PDF
   * @param {HTMLElement|string} element - Org chart element
   */
  async function exportOrgChartToPDF(element) {
    return exportToPDF(
      element,
      locale.value === "az" ? "teshkilati-struktur" : "org-chart"
    );
  }

  /**
   * Export Gantt chart to PNG
   * @param {HTMLElement|string} element - Gantt chart element
   */
  async function exportGanttToPNG(element) {
    return exportToPNG(
      element,
      locale.value === "az" ? "gantt-diaqram" : "gantt-chart"
    );
  }

  /**
   * Export dashboard to PDF
   * @param {HTMLElement|string} element - Dashboard element
   */
  async function exportDashboardToPDF(element) {
    return exportToPDF(
      element,
      locale.value === "az" ? "idare-paneli" : "dashboard"
    );
  }

  /**
   * Export calculator results to Excel
   * @param {Object} data - Calculator result data
   * @param {string} type - Calculator type (budget, resource, roi)
   */
  function exportCalculatorToExcel(data, type) {
    const filename =
      locale.value === "az" ? `kalkulyator-${type}` : `calculator-${type}`;

    return exportToExcel([data], filename, type.toUpperCase());
  }

  return {
    exportToPDF,
    exportToExcel,
    exportToPNG,
    exportProjectsToExcel,
    exportTasksToExcel,
    exportOrgChartToPDF,
    exportGanttToPNG,
    exportDashboardToPDF,
    exportCalculatorToExcel,
  };
}
