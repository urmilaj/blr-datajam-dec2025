import * as d3 from "npm:d3";
import * as Plot from "npm:@observablehq/plot";

export function getYearRange(dataset, dateColumn) {
  const parseDate = d3.timeParse("%Y-%m-%d");
  
  const validDates = dataset
    .filter(d => d[dateColumn])
    .map(d => parseDate(d[dateColumn]))
    .filter(d => d !== null);
  
  if (validDates.length === 0) {
    return { min: null, max: null };
  }
  
  const years = validDates.map(d => d.getFullYear());
  return {
    min: d3.min(years),
    max: d3.max(years)
  };
}

export function getUniqueSpeciesCount(data, columnName) {
  return new Set(data.map(d => d[columnName])).size;
}

export function createSparklineChart(data, dateField, width, color) {
  // Process data for sparklines - create yearly counts
  const validData = data.filter(d => {
    const hasValidDate = d[dateField];
    const isResearchGrade = !d.quality_grade || d.quality_grade === 'research';
    return hasValidDate && isResearchGrade;
  });
  
  if (validData.length === 0) return Plot.plot({width, height: 550});
  
  const yearCounts = d3.rollup(
    validData, 
    v => v.length, 
    d => new Date(d[dateField]).getFullYear()
  );
  
  const years = Array.from(yearCounts.keys()).sort();
  const minYear = d3.min(years);
  const maxYear = d3.max(years);
  
  // Create array with objects containing year and count
  const sparklineData = [];
  for (let year = minYear; year <= maxYear; year++) {
    sparklineData.push({
      year: year,
      yearShort: String(year).slice(-2), // Last two digits
      count: yearCounts.get(year) || 0
    });
  }
  
  // Find peak value
  const peakData = sparklineData.reduce((max, curr) => curr.count > max.count ? curr : max);
  
  // Create data for start and end year labels
  const startYear = sparklineData[0];
  const endYear = sparklineData[sparklineData.length - 1];
  
  return Plot.plot({
    marks: [
      Plot.ruleX([startYear.year], {stroke: "lightgray", strokeWidth: 0.5, opacity: 1}),
      Plot.ruleX([endYear.year], { stroke: "lightgray", strokeWidth: 0.5, opacity: 1 }),
      Plot.lineY(sparklineData, {x: "year", y: "count", stroke: color, strokeWidth: 2.5}),
      // Peak value annotation
      Plot.text([peakData], {x: "year", y: "count", text: d => `${d.count.toLocaleString()} observations in ${d.year}`, dy: -8, fontSize: 12, fill: "#212121"}),
      // Start year label at bottom of vertical line
      Plot.text([startYear], {x: "year", y: 0, text: d => String(d.year), dy: 8, fontSize: 9, fill: "gray", textAnchor: "middle"}),
      // End year label at bottom of vertical line
      Plot.text([endYear], {x: "year", y: 0, text: d => String(d.year), dy: 8, fontSize: 9, fill: "gray", textAnchor: "middle"})
    ],
    width: 180, 
    height: 80, 
    marginTop: 25, 
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 0,
    x: {axis: null}, 
    y: {axis: null}
  });
}