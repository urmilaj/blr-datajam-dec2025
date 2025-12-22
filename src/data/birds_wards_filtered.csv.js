import {readFileSync} from "node:fs";

// Read and parse CSV
const csvText = readFileSync("src/data/birds_with_wards.csv", "utf-8");
const lines = csvText.split("\n");
const header = lines[0];
const rows = lines.slice(1);

// Parse header to find name_en column index
const headers = header.split(",");
const nameEnIndex = headers.findIndex(h => h.trim() === 'name_en' || h.trim() === '"name_en"');

// Filter rows where name_en is not empty
const filtered = [header, ...rows.filter(row => {
  const columns = row.split(",");
  const nameEn = columns[nameEnIndex];
  return nameEn && nameEn.trim() !== "" && nameEn.trim() !== '""';
})].join("\n");

process.stdout.write(filtered);
