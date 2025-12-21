---
title: Pollinators
theme: [dashboard, light]
---

```js
import tippy from "tippy.js";
```

```js
const blr = await FileAttachment("./data/blr-topo.json").json();

const birds = await FileAttachment("./data/birds_combined_upto_2025.csv").csv();

const moths_and_butterflies = await FileAttachment("./data/moths_butterflies_combined_upto_2025.csv").csv();

const bees = await FileAttachment("./data/bees_combined_upto_2025.csv").csv();

const wasps = await FileAttachment("./data/wasps_combined_upto_2025.csv").csv();

import { getYearRange, createSparklineChart, getUniqueSpeciesCount, getMonthlyObservationCounts, createMonthlyBarChart, getMonthlyObservationsWithData, createInteractiveBrushMap } from "./components/utils.js";
```

```js
const filteredMothsAndButterflies = moths_and_butterflies.filter((d) => d.quality_grade === "research")

const filteredBees = bees.filter((d) => d.quality_grade === "research")

const filteredWasps = wasps.filter((d) => d.quality_grade === "research")


const chartWidth = Generators.width(document.querySelector(".barChartCard"));

const blrMap = topojson.feature(blr, blr.objects.blr);
const svgWidth = width;
const svgHeight = 800;
```

```js
const projection = d3.geoMercator().fitSize([svgWidth, svgHeight], blrMap);

const path = d3.geoPath(projection);
```

# Overview

Bangalore's urban ecosystem analysis of pollinators combines data from two data sources: [**iNaturalist**](https://www.inaturalist.org/) for invertebrate pollinators (bees, wasps, moths, and butterflies) and [**eBird**](https://ebird.org/home) for avian pollinators, primarily focusing on nectar-feeding birds (purple sunbirds and pale-billed flowerpeckers) documented through comprehensive citizen science efforts spanning nearly five decades.

<div class="grid grid-cols-4">
  <div class="card">
    <h1 class="card-title">Birds</h1>
    <h2 class="card-subtitle">Family: Nectariniidae</h2>
    <h1 class="card-count">${birds.length.toLocaleString()}</h1> observations between the years ${getYearRange(birds, "OBSERVATION.DATE", d3).min} and ${getYearRange(birds, "OBSERVATION.DATE", d3).max} for <b style="color:#6F73D2">${getUniqueSpeciesCount(birds, "COMMON.NAME")} species</b>
    <div style="margin-top: 15px;">${createSparklineChart(birds, "OBSERVATION.DATE", width, '#6F73D2', 'Trends for nectar-feeding birds')}</div>
  </div>
  <div class="card">
    <h1 class="card-title">Moths and Butterflies</h1>
    <h2 class="card-subtitle">Family: Papilionidae and Nymphalidae</h2>
    <h1 class="card-count">${filteredMothsAndButterflies.length.toLocaleString()}</h1> observations between the years ${getYearRange(filteredMothsAndButterflies, "observed_on", d3).min} and ${getYearRange(filteredMothsAndButterflies, "observed_on", d3).max} for <b style="color:#C04ABC">${getUniqueSpeciesCount(filteredMothsAndButterflies, "common_name")} species</b>
    <div style="margin-top: 15px;">${createSparklineChart(filteredMothsAndButterflies, "observed_on", width, '#C04ABC', 'Trends for moths and butterflies')}</div>
  </div>
  <div class="card">
    <h1 class="card-title">Bees</h1>
    <h2 class="card-subtitle">Super Family: Apoidea</h2>
    <h1 class="card-count">${filteredBees.length.toLocaleString()}</h1> observations between the years ${getYearRange(filteredBees, "observed_on", d3).min} and ${getYearRange(filteredBees, "observed_on", d3).max} for <b style="color:#EA7317">${getUniqueSpeciesCount(filteredBees, "common_name")} species</b>
    <div style="margin-top: 15px;">${createSparklineChart(filteredBees, "observed_on", width, '#EA7317', 'Trends for bees')}</div>
  </div>
  <div class="card">
    <h1 class="card-title">Wasps</h1>
    <h2 class="card-subtitle">Family: Vespidae</h2>
    <h1 class="card-count">${filteredWasps.length.toLocaleString()}</h1> observations between the years ${getYearRange(filteredWasps, "observed_on", d3).min} and ${getYearRange(filteredWasps, "observed_on", d3).max} for <b style="color:#A8B25D">${getUniqueSpeciesCount(filteredWasps, "common_name")} species</b>
    <div style="margin-top: 15px;">${createSparklineChart(filteredWasps, "observed_on", width, '#A8B25D', 'Trends for wasps')}</div>
  </div>
</div>

---

<div class="grid grid-cols-2">
  <div>
    <div class="barChartCard">${createMonthlyBarChart(birds, "OBSERVATION.DATE", chartWidth, '#6F73D2', 'Bird seasonality')}</div>
  </div>
  <!-- <div>
    <div class="barChartCard">${createMonthlyBarChart(filteredMothsAndButterflies, "observed_on", chartWidth, '#C04ABC', 'Moths and butterflies seasonal patterns')}</div>
  </div>
  <div>
    <div class="barChartCard">${createMonthlyBarChart(filteredBees, "observed_on", chartWidth, '#EA7317', 'Bee seasonal patterns')}</div>
  </div>
  <div>
    <div class="barChartCard">${createMonthlyBarChart(filteredWasps, "observed_on", chartWidth, '#A8B25D', 'Wasps seasonal patterns')}</div>
  </div> -->
</div>




```js
getMonthlyObservationsWithData(filteredBees, "observed_on")
```

```js
// In your .md file
view(createInteractiveBrushMap(filteredBees, "observed_on", blr, 800, "#f59e0b", "Bee Observations"))
```

```js
blrMap.features;
```

```js
const svg = d3.create("svg").attr("width", svgWidth).attr("height", svgHeight).attr("viewBox", [0, 0, svgWidth, svgHeight]);

const blrWards = svg
  .append("g")
  .selectAll("path")
  .data(blrMap.features)
  .join("path")
  .attr("d", path)
  .attr("fill", "white")
  .attr("stroke", "gray")
  .attr("data-tippy-content", (d) => `<h1>${d.properties.name_en}</h1>`);

const beesData = svg
  .append("g")
  .selectAll("circle")
  .data(bees.filter((d) => d.quality_grade === "research"))
  .join("circle")
  .attr("cx", (d) => projection([+d.longitude, +d.latitude])[0])
  .attr("cy", (d) => projection([+d.longitude, +d.latitude])[1])
  .attr("r", 2)
  .attr("fill", "none")
  .attr("stroke", "orange")
  .attr("data-tippy-content", (d) => `<h1>${d.common_name}</h1>`);

// tippy(blrWards.nodes(), {
//   theme: "custom",
//   allowHTML: true,
//   arrow: true,
//   placement: "top",
//   trigger: 'mouseenter focusin',
// });

// tippy(beesData.nodes(), {
//   theme: "custom",
//   allowHTML: true,
//   arrow: true,
//   placement: "top",
//   trigger: 'mouseenter focusin',
// });

display(svg.node());
```

```js
// First, let's process the data to extract year and month information
const processedData = bees
  .filter((d) => d.quality_grade === "research" && d.observed_on && d.common_name)
  .map((d) => {
    const date = new Date(d.observed_on);
    return {
      ...d,
      year: date.getFullYear(),
      month: date.getMonth() + 1, // JavaScript months are 0-indexed
      yearMonth: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    };
  });

// Group by year and common_name to get yearly counts
const yearlyData = d3.group(
  processedData,
  (d) => d.year,
  (d) => d.common_name
);
const yearlySummary = [];

yearlyData.forEach((beeTypes, year) => {
  beeTypes.forEach((records, beeType) => {
    yearlySummary.push({
      year: year,
      beeType: beeType,
      count: records.length,
    });
  });
});

// Group by year-month and common_name to get monthly counts
const monthlyData = d3.group(
  processedData,
  (d) => d.yearMonth,
  (d) => d.common_name
);
const monthlySummary = [];

monthlyData.forEach((beeTypes, yearMonth) => {
  beeTypes.forEach((records, beeType) => {
    const [year, month] = yearMonth.split("-");
    monthlySummary.push({
      year: +year,
      month: +month,
      yearMonth: yearMonth,
      beeType: beeType,
      count: records.length,
    });
  });
});
```

```js
yearlySummary;
```

```js
monthlySummary;
```

```js
// Create a pivot table for yearly data
const yearlyPivot = d3.rollup(
  processedData,
  (v) => v.length,
  (d) => d.year,
  (d) => d.common_name
);

// Convert to array format for easier display
const yearlyTableData = [];
yearlyPivot.forEach((beeTypes, year) => {
  const row = { year: year };
  beeTypes.forEach((count, beeType) => {
    row[beeType] = count;
  });
  yearlyTableData.push(row);
});

// Create a pivot table for monthly data
const monthlyPivot = d3.rollup(
  processedData,
  (v) => v.length,
  (d) => d.yearMonth,
  (d) => d.common_name
);

// Convert to array format for easier display
const monthlyTableData = [];
monthlyPivot.forEach((beeTypes, yearMonth) => {
  const [year, month] = yearMonth.split("-");
  const row = {
    year: +year,
    month: +month,
    yearMonth: yearMonth,
  };
  beeTypes.forEach((count, beeType) => {
    row[beeType] = count;
  });
  monthlyTableData.push(row);
});
```

```js
Inputs.table(yearlyTableData);
```

```js
Inputs.table(monthlyTableData);
```

```js
// Create dropdown for selecting view type
const viewSelector = view(
  Inputs.select(
    new Map([
      ["Yearly Summary", "yearly"],
      ["Monthly Summary", "monthly"],
    ]),
    {
      label: "Choose time period:",
      value: "yearly",
    }
  )
);
```

```js
// Prepare chart data based on selection
const selectedData = viewSelector === "yearly" ? yearlySummary : monthlySummary;

// Get all unique bee species for consistent coloring
const allBeeSpecies = [...new Set(selectedData.map((d) => d.beeType))];
const speciesColors = d3.scaleOrdinal().domain(allBeeSpecies).range(d3.schemeSet3);

// Transform data for stacked visualization
const timeGroups = d3.group(selectedData, (d) => (viewSelector === "yearly" ? d.year : d.yearMonth));

const chartDataPoints = Array.from(timeGroups, ([period, observations]) => {
  const dataPoint = { period: period.toString() };
  allBeeSpecies.forEach((species) => {
    const match = observations.find((obs) => obs.beeType === species);
    dataPoint[species] = match ? match.count : 0;
  });
  return dataPoint;
}).sort((a, b) => a.period.localeCompare(b.period));

// Chart dimensions
const chartMargins = { top: 30, right: 120, bottom: 80, left: 50 };
const chartW = width - chartMargins.left - chartMargins.right;
const chartH = 450 - chartMargins.top - chartMargins.bottom;

// Create SVG container
const barChart = d3.create("svg").attr("width", width).attr("height", 450);

const chartGroup = barChart.append("g").attr("transform", `translate(${chartMargins.left}, ${chartMargins.top})`);

// Prepare stacked data
const stackGenerator = d3.stack().keys(allBeeSpecies);

const layers = stackGenerator(chartDataPoints);

// Setup scales
const xAxis = d3
  .scaleBand()
  .domain(chartDataPoints.map((d) => d.period))
  .range([0, chartW])
  .paddingInner(0.15);

const yAxis = d3
  .scaleLinear()
  .domain([0, d3.max(layers.flat(), (d) => d[1])])
  .range([chartH, 0])
  .nice();

// Draw stacked bars
chartGroup
  .selectAll(".stack-layer")
  .data(layers)
  .join("g")
  .attr("class", "stack-layer")
  .attr("fill", (d) => speciesColors(d.key))
  .selectAll("rect")
  .data((d) => d)
  .join("rect")
  .attr("x", (d) => xAxis(d.data.period))
  .attr("y", (d) => yAxis(d[1]))
  .attr("width", xAxis.bandwidth())
  .attr("height", (d) => yAxis(d[0]) - yAxis(d[1]));

// Add X-axis
chartGroup.append("g").attr("transform", `translate(0, ${chartH})`).call(d3.axisBottom(xAxis)).selectAll("text").attr("transform", "rotate(-45)").style("text-anchor", "end");

// Add Y-axis
chartGroup.append("g").call(d3.axisLeft(yAxis));

// Add axis labels
chartGroup
  .append("text")
  .attr("x", chartW / 2)
  .attr("y", chartH + 60)
  .attr("text-anchor", "middle")
  .style("font-size", "12px")
  .text(viewSelector === "yearly" ? "Year" : "Month");

chartGroup
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -chartH / 2)
  .attr("y", -35)
  .attr("text-anchor", "middle")
  .style("font-size", "12px")
  .text("Number of Observations");

// Add legend
const legendGroup = barChart.append("g").attr("transform", `translate(${width - 110}, 50)`);

const legendItems = legendGroup
  .selectAll(".legend-item")
  .data(allBeeSpecies)
  .join("g")
  .attr("class", "legend-item")
  .attr("transform", (d, i) => `translate(0, ${i * 18})`);

legendItems
  .append("rect")
  .attr("width", 12)
  .attr("height", 12)
  .attr("fill", (d) => speciesColors(d));

legendItems
  .append("text")
  .attr("x", 18)
  .attr("y", 9)
  .style("font-size", "10px")
  .text((d) => (d.length > 15 ? d.substring(0, 15) + "..." : d));

display(barChart.node());
```

```js
// Create dropdown for selecting bee species
const beeSpeciesSelector = view(
  Inputs.select([...new Set(processedData.map((d) => d.common_name))].sort(), {
    label: "Choose bee species:",
    value: "Giant Honey Bee",
  })
);
```

```js
// Create dropdown for selecting year (initially hidden)
const availableYears = [...new Set(processedData.filter((d) => d.common_name === beeSpeciesSelector).map((d) => d.year))].sort();

const yearSelector = view(
  Inputs.select(["All Years", ...availableYears], {
    label: "Choose year (optional):",
    value: "All Years",
  })
);
```

```js
// Prepare chart data based on selections
let chartData, chartTitle, xAxisLabel;

if (yearSelector === "All Years") {
  // Show yearly data for selected bee species
  chartData = yearlySummary.filter((d) => d.beeType === beeSpeciesSelector).map((d) => ({ period: d.year.toString(), count: d.count }));
  chartTitle = `${beeSpeciesSelector} - Yearly Observations`;
  xAxisLabel = "Year";
} else {
  // Show monthly data for selected bee species and year
  chartData = monthlySummary
    .filter((d) => d.beeType === beeSpeciesSelector && d.year === yearSelector)
    .map((d) => ({
      period: new Date(d.year, d.month - 1).toLocaleDateString("en-US", { month: "short" }),
      count: d.count,
    }));
  chartTitle = `${beeSpeciesSelector} - Monthly Observations (${yearSelector})`;
  xAxisLabel = "Month";
}

// Chart dimensions
const chartMargins = { top: 50, right: 40, bottom: 80, left: 60 };
const chartW = width - chartMargins.left - chartMargins.right;
const chartH = 400 - chartMargins.top - chartMargins.bottom;

// Create SVG container
const barChart = d3.create("svg").attr("width", width).attr("height", 400);

const chartGroup = barChart.append("g").attr("transform", `translate(${chartMargins.left}, ${chartMargins.top})`);

// Setup scales
const xScale = d3
  .scaleBand()
  .domain(chartData.map((d) => d.period))
  .range([0, chartW])
  .paddingInner(0.2);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(chartData, (d) => d.count) || 0])
  .range([chartH, 0])
  .nice();

// Draw bars
chartGroup
  .selectAll(".bar")
  .data(chartData)
  .join("rect")
  .attr("class", "bar")
  .attr("x", (d) => xScale(d.period))
  .attr("y", (d) => yScale(d.count))
  .attr("width", xScale.bandwidth())
  .attr("height", (d) => chartH - yScale(d.count))
  .attr("fill", "steelblue")
  .attr("stroke", "white")
  .attr("stroke-width", 1);

// Add value labels on bars
chartGroup
  .selectAll(".bar-label")
  .data(chartData)
  .join("text")
  .attr("class", "bar-label")
  .attr("x", (d) => xScale(d.period) + xScale.bandwidth() / 2)
  .attr("y", (d) => yScale(d.count) - 5)
  .attr("text-anchor", "middle")
  .style("font-size", "12px")
  .style("fill", "black")
  .text((d) => d.count);

// Add X-axis
chartGroup
  .append("g")
  .attr("transform", `translate(0, ${chartH})`)
  .call(d3.axisBottom(xScale))
  .selectAll("text")
  .attr("transform", yearSelector === "All Years" ? "rotate(-45)" : "rotate(0)")
  .style("text-anchor", yearSelector === "All Years" ? "end" : "middle");

// Add Y-axis
chartGroup.append("g").call(d3.axisLeft(yScale));

// Add axis labels
chartGroup
  .append("text")
  .attr("x", chartW / 2)
  .attr("y", chartH + (yearSelector === "All Years" ? 60 : 40))
  .attr("text-anchor", "middle")
  .style("font-size", "14px")
  .style("font-weight", "bold")
  .text(xAxisLabel);

chartGroup
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -chartH / 2)
  .attr("y", -40)
  .attr("text-anchor", "middle")
  .style("font-size", "14px")
  .style("font-weight", "bold")
  .text("Number of Observations");

// Add chart title
chartGroup
  .append("text")
  .attr("x", chartW / 2)
  .attr("y", -20)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("font-weight", "bold")
  .text(chartTitle);

display(barChart.node());
```

```js
// Analyze yearly trends for each bee species
const yearlyTrends = {};
const beeSpecies = [...new Set(yearlySummary.map((d) => d.beeType))];

beeSpecies.forEach((species) => {
  const speciesData = yearlySummary.filter((d) => d.beeType === species).sort((a, b) => a.year - b.year);

  if (speciesData.length > 1) {
    const firstYear = speciesData[0];
    const lastYear = speciesData[speciesData.length - 1];
    const totalChange = lastYear.count - firstYear.count;
    const percentChange = ((totalChange / firstYear.count) * 100).toFixed(1);

    yearlyTrends[species] = {
      firstYear: firstYear.year,
      lastYear: lastYear.year,
      firstCount: firstYear.count,
      lastCount: lastYear.count,
      totalChange: totalChange,
      percentChange: percentChange,
      trend: totalChange > 0 ? "Increasing" : totalChange < 0 ? "Declining" : "Stable",
    };
  }
});
```

```js
yearlyTrends;
```

```js
// Find species with most dramatic changes
const dramaticChanges = Object.entries(yearlyTrends)
  .map(([species, data]) => ({ species, ...data }))
  .sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange));

console.log("Most Dramatic Changes:");
dramaticChanges.slice(0, 5).forEach((d) => {
  console.log(`${d.species}: ${d.percentChange}% change (${d.trend})`);
});
```

```js
dramaticChanges;
```

```js
// Analyze peak observation years for each species
const peakYears = {};
beeSpecies.forEach((species) => {
  const speciesData = yearlySummary.filter((d) => d.beeType === species);
  const peak = speciesData.reduce((max, curr) => (curr.count > max.count ? curr : max));
  peakYears[species] = {
    peakYear: peak.year,
    peakCount: peak.count,
    totalObservations: speciesData.reduce((sum, d) => sum + d.count, 0),
  };
});
```

```js
peakYears;
```

```js
// Find co-occurrence patterns - species observed in same years
const yearlyCoOccurrence = {};
Object.keys(peakYears).forEach((species1) => {
  Object.keys(peakYears).forEach((species2) => {
    if (species1 !== species2) {
      const species1Years = new Set(yearlySummary.filter((d) => d.beeType === species1).map((d) => d.year));
      const species2Years = new Set(yearlySummary.filter((d) => d.beeType === species2).map((d) => d.year));

      const commonYears = [...species1Years].filter((year) => species2Years.has(year));
      const coOccurrenceRate = ((commonYears.length / Math.max(species1Years.size, species2Years.size)) * 100).toFixed(1);

      if (commonYears.length > 0) {
        yearlyCoOccurrence[`${species1} + ${species2}`] = {
          commonYears: commonYears.length,
          coOccurrenceRate: `${coOccurrenceRate}%`,
          sharedYears: commonYears.sort(),
        };
      }
    }
  });
});
```

```js
// Show top co-occurrences
Object.entries(yearlyCoOccurrence)
  .sort((a, b) => parseFloat(b[1].coOccurrenceRate) - parseFloat(a[1].coOccurrenceRate))
  .slice(0, 10);
```

```js
// Seasonal patterns analysis using monthly data
const seasonalPatterns = {};
beeSpecies.forEach((species) => {
  const speciesMonthly = monthlySummary.filter((d) => d.beeType === species);
  const monthlyTotals = {};

  for (let month = 1; month <= 12; month++) {
    monthlyTotals[month] = speciesMonthly.filter((d) => d.month === month).reduce((sum, d) => sum + d.count, 0);
  }

  const peakMonth = Object.entries(monthlyTotals).reduce((max, [month, count]) => (count > max.count ? { month: +month, count } : max), { month: 1, count: 0 });

  seasonalPatterns[species] = {
    peakMonth: peakMonth.month,
    peakMonthName: new Date(2000, peakMonth.month - 1).toLocaleDateString("en-US", { month: "long" }),
    peakCount: peakMonth.count,
    monthlyDistribution: monthlyTotals,
  };
});
```

```js
seasonalPatterns;
```

```js
// Recent vs Historical comparison (if data spans multiple periods)
const recentVsHistorical = {};
const currentYear = new Date().getFullYear();
const cutoffYear = 2015; // Adjust based on your data

beeSpecies.forEach((species) => {
  const historical = yearlySummary.filter((d) => d.beeType === species && d.year < cutoffYear).reduce((sum, d) => sum + d.count, 0);

  const recent = yearlySummary.filter((d) => d.beeType === species && d.year >= cutoffYear).reduce((sum, d) => sum + d.count, 0);

  if (historical > 0 && recent > 0) {
    recentVsHistorical[species] = {
      historical: historical,
      recent: recent,
      change: recent - historical,
      percentChange: (((recent - historical) / historical) * 100).toFixed(1),
    };
  }
});
```

```js
Object.entries(recentVsHistorical).sort((a, b) => parseFloat(b[1].percentChange) - parseFloat(a[1].percentChange));
```

```js
// Inputs.table(bees.filter(d=>d.quality_grade==='research'))
bees.filter((d) => d.quality_grade === "research");
```

```js
// Inputs.table(bees.filter(d=>d.quality_grade==='research'))
birds;
```

```js
// Inputs.table(bees.filter(d=>d.quality_grade==='research'))
moths_and_butterflies.filter((d) => d.quality_grade === "research");
```

```js
// Inputs.table(bees.filter(d=>d.quality_grade==='research'))
wasps.filter((d) => d.quality_grade === "research");
```

<style>
    @import url('tippy.js/dist/tippy.css');
    @import url('tippy.js/dist/border.css');

      h1, h2, h3, h4, h5, li, p, text {
    font-family: sans-serif;
  }

    .card-title {
        font-size: 18px;
        color: #515151;
    }

    .card-count {
        display: inline;
    }

    .card-subtitle {
        font-size: 13px;
        color: #8a8a8aff;
    }
  
  .tippy-box[data-theme~='custom'] {
    background-color: white;
    border: black 1px solid;
    color: black;
    padding: 0.1rem;
    font-family: 'sans-serif';
    min-width: 170px;
}

.tippy-box[data-theme~='custom'][data-placement^='top'] > .tippy-arrow::before {
    border-top-color: white;
}

.tippy-box[data-theme~='custom'][data-placement^='bottom'] > .tippy-arrow::before {
    border-bottom-color: white;
}
  
.tippy-box[data-theme~='custom'][data-placement^='left'] > .tippy-arrow::before {
    border-left-color: white;
}

.tippy-box[data-theme~='custom'][data-placement^='right'] > .tippy-arrow::before {
    border-right-color: white;
}

  .tippy-box h1 {
    font-size:1rem;
    font-weight:bold;
    padding-bottom:1px;
  }

  .tippy-box h2 {
    font-size:0.9rem;
    font-weight:normal;
    padding-bottom:1px
  }

  .tippy-box hr {
    padding: 0px;
    border-top: 2px solid black;
  }

  .tippy-box p {
    padding: 0px;
    font-weight:400;
    margin-top: 1px;
    margin-bottom: 3px;
  }
</style>
