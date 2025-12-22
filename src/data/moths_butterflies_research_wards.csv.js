import {readFileSync} from "node:fs";

// Read and parse CSV
const csvText = readFileSync("src/data/mothsAndButterflies_with_wards.csv", "utf-8");
const lines = csvText.split("\n");
const header = lines[0];
const rows = lines.slice(1);

// Parse header to find column indices
const headers = header.split(",");
const qualityIndex = headers.findIndex(h => h.trim() === 'quality_grade' || h.trim() === '"quality_grade"');
const nameEnIndex = headers.findIndex(h => h.trim() === 'name_en' || h.trim() === '"name_en"');

// Filter rows where quality_grade is "research" and name_en is not empty
const filtered = [header, ...rows.filter(row => {
  const columns = row.split(",");
  const quality = columns[qualityIndex];
  const nameEn = columns[nameEnIndex];
  return quality && (quality.trim() === 'research' || quality.trim() === '"research"') &&
         nameEn && nameEn.trim() !== "" && nameEn.trim() !== '""';
})].join("\n");

process.stdout.write(filtered);
