import fs from "fs";
import path from "path";
import PptxGenJS from "pptxgenjs";

const outDir = path.resolve("dist");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const pptx = new PptxGenJS();
pptx.author = "PMO Demo";
pptx.company = "PMO";

// Helper: try to find project screenshots in ./screenshots or public
function findImages() {
  const candidates = [];
  const searchDirs = ["screenshots", "public", "src/assets"];
  for (const d of searchDirs) {
    const dir = path.resolve(d);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const ext = f.split(".").pop().toLowerCase();
      if (["png", "jpg", "jpeg", "svg"].includes(ext)) {
        candidates.push(path.join(dir, f));
      }
    }
  }
  return candidates;
}

const images = findImages();

function addTitleSlide() {
  const slide = pptx.addSlide();
  slide.addText("Layihə Ofisi (PMO) — Məqsəd və Təşkili", {
    x: 0.5,
    y: 1.0,
    w: "90%",
    h: 1.2,
    fontSize: 28,
    bold: true,
  });
  slide.addText("PMO Demo Platform — Presentation", {
    x: 0.5,
    y: 2.2,
    w: "90%",
    h: 0.8,
    fontSize: 14,
  });
  slide.addText(`Hazırlayan: PMO Demo`, {
    x: 0.5,
    y: 3.4,
    fontSize: 12,
    color: "666666",
  });
}

function addSimpleSlide(title, bullets, notes) {
  const slide = pptx.addSlide();
  slide.addText(title, { x: 0.5, y: 0.3, w: "90%", fontSize: 20, bold: true });
  let y = 1.2;
  for (const b of bullets) {
    slide.addText("\u2022 " + b, { x: 0.7, y, w: "90%", fontSize: 14 });
    y += 0.5;
  }
  if (notes) slide.addNotes(notes);
}

addTitleSlide();
addSimpleSlide(
  "Ümumi Layihənin Məqsədi",
  [
    "Layihələrin məqsədə uyğun, vaxtında və büdcə daxilində həyata keçirilməsi",
    "Resursların effektiv istifadəsi və prioritetləşdirmənin mərkəzləşdirilməsi",
    "Standart proseslərin tətbiqi və keyfiyyətin yüksəldilməsi",
  ],
  "Təqdimat: layihənin biznes faydasına fokuslanın"
);

addSimpleSlide(
  "PMO nədir?",
  [
    "Project Management Office — Layihə idarəetməsini mərkəzləşdirir",
    "Strateji və icra arasında körpü rolunu oynayır",
  ],
  "Qısa tərif və nümunə"
);

addSimpleSlide(
  "PMO-nun Əsas Funksiyaları",
  [
    "Strateji əlaqələndirmə",
    "Standartlar və metodologiya",
    "Portfolio idarəçiliyi",
    "Monitorinq və hesabat",
  ],
  "Hər funksiyanı qısa nümunə ilə izah edin"
);

// If images exist, add slides with images
if (images.length > 0) {
  let idx = 0;
  for (const imgPath of images) {
    const slide = pptx.addSlide();
    slide.addText("Project Screenshot", {
      x: 0.5,
      y: 0.3,
      w: "90%",
      fontSize: 18,
      bold: true,
    });
    // place image
    slide.addImage({ path: imgPath, x: 0.5, y: 1.0, w: 9, h: 5 });
    slide.addNotes(`Screenshot from: ${imgPath}`);
    idx++;
    if (idx >= 6) break;
  }
} else {
  addSimpleSlide(
    "Project Screenshots (placeholder)",
    [
      "Dashboard: Açıq qrafiklər və KPI kartları",
      "Gantt: Tapşırıqlar və zaman qrafiki",
      "OrgChart: Təşkilati struktur ağacı",
      "Calculator: ROI və büdcə nümunələri",
    ],
    "Məlumat: screenshots/ qovluğuna şəkillər əlavə edin və yenidən run edin"
  );
}

addSimpleSlide(
  "PMO Prosesi (5 mərhələ)",
  [
    "1. Başlanğıc",
    "2. Planlaşdırma",
    "3. İcra",
    "4. Monitorinq",
    "5. Bağlanış",
  ],
  "Workflow modulundan vizual əlavə edin"
);

addSimpleSlide(
  "Implementasiya Yol Xəritəsi",
  [
    "Faza 1: PMO quruluşunun təsviri, pilot layihə",
    "Faza 2: Proses və şablonların tətbiqi",
    "Faza 3: Tam inteqrasiya və təlimlər",
  ],
  "Hər fazanın deliverables qeyd edilsin"
);

addSimpleSlide(
  "Növbəti Addımlar",
  [
    "PMO strukturunun təsdiqi",
    "Pilot layihə və konfiqurasiya",
    "Təlim planı və 90 günlük hesabat",
  ],
  "Məsuliyyət və vaxt çərçivəsi əlavə edin"
);

// Save
const outPath = path.join(outDir, "PMO_Presentation.pptx");
await pptx.writeFile({ fileName: outPath });
console.log("PPTX created:", outPath);
