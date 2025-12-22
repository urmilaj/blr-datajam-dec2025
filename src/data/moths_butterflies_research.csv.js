import {readFileSync} from "node:fs";

// Read and parse CSV
const csvText = readFileSync("src/data/moths_butterflies_combined_upto_2025.csv", "utf-8");
const lines = csvText.split("\n");
const header = lines[0];
const rows = lines.slice(1);

// Parse header to find quality_grade column index
const headers = header.split(",");
const qualityIndex = headers.findIndex(h => h.trim() === 'quality_grade' || h.trim() === '"quality_grade"');

// Filter rows where quality_grade is "research"
const filtered = [header, ...rows.filter(row => {
  const columns = row.split(",");
  const quality = columns[qualityIndex];
  return quality && (quality.trim() === 'research' || quality.trim() === '"research"');
})].join("\n");

process.stdout.write(filtered);
