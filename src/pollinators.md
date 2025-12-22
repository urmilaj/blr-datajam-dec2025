---
title: Pollinators
theme: [dashboard, light]
---

```js
import tippy from "tippy.js";
```

```js
const blr = await FileAttachment("./data/blr-topo.json").json()

// Birds - use original files (no quality_grade filter needed for eBird data)
const birds = await FileAttachment("./data/birds_combined_upto_2025.csv").csv()
const bird_wards = await FileAttachment("./data/birds_with_wards.csv").csv()

const moths_and_butterflies = await FileAttachment("./data/moths_butterflies_research.csv").csv()
const mothAndButterflies_wards = await FileAttachment("./data/moths_butterflies_research_wards.csv").csv()

const bees = await FileAttachment("./data/bees_research.csv").csv()
const bees_wards = await FileAttachment("./data/bees_research_wards.csv").csv()

const wasps = await FileAttachment("./data/wasps_research.csv").csv()
const wasps_wards = await FileAttachment("./data/wasps_research_wards.csv").csv()

import { getYearRange, getUniqueSpeciesCount, createSparklineChart, createObservationMap, createMonthlyBarChart } from "./components/utils.js";
```


```js
// Filter birds for valid ward names (birds don't have quality_grade)
const filteredBirds_wards = bird_wards.filter(d=>d.name_en !== "");

// Data is already pre-filtered by data loaders for other datasets
const filteredMothsAndButterflies = moths_and_butterflies;
const filteredMothsAndButterflies_wards = mothAndButterflies_wards;
const filteredBees = bees;
const filteredBees_wards = bees_wards;
const filteredWasps = wasps;
const filteredWasps_wards = wasps_wards;

const birdColor = "#6F73D2";
const mothAndButterflyColor = "#C04ABC";
const beeColor = "#EA7317";
const waspColor = "#A8B25D"

const chartWidth = Generators.width(document.querySelector(".barChartCard"));

const blrMap = topojson.feature(blr, blr.objects.blr);
const svgWidth = width;
const svgHeight = 800;
```

```js
const projection = d3.geoMercator().fitSize([svgWidth, svgHeight], blrMap);

const path = d3.geoPath(projection);

const obsContainer = Generators.width(document.querySelector(".obsMapContainer"))

const wardContainer = Generators.width(document.querySelector(".obsMapContainer"))
```

```js
const wardNames = blrMap.features.map(f => f.properties.name_en);

const wardWidth = 500;
const wardHeight = 500;
```

##### Team: Bindu, Ekansh, Sharath, Tanaya, Tullika, Vaibhavi, Urmila
##### Date: December 13, 2025

---

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

```js
const birdSearch = Inputs.search(filteredBirds_wards, {
  placeholder: "Search birds by name, locality, or ward...",
});

const birdSearchGenerator = Generators.input(birdSearch)
```

```js
const birdTable = Inputs.table(birdSearchGenerator, {
  columns: ["OBSERVATION.DATE","COMMON.NAME", "LOCALITY","name_en", "LATITUDE", "LONGITUDE"], 
  header: {
    "OBSERVATION.DATE": "Date",
    "COMMON.NAME": "Common name",
    "LOCALITY": "Locality name",
    "name_en": "Ward name",
    "LATITUDE": "Latitude",
    "LONGITUDE": "Longitude",
  }
});

const birdTableMapData = Generators.input(birdTable);
```

## Birds analysis

The data below primarily focuses on nectar-feeding birds, specifically purple sunbirds and pale-billed flowerpeckers.

<br>

<div class="grid grid-cols-2">
    <div class="grid-rowspan-2">
      <h3>Bird observation map (${getYearRange(birdTableMapData, "OBSERVATION.DATE", d3).min} to ${getYearRange(birdTableMapData, "OBSERVATION.DATE", d3).max})</h3>
      <p style="margin:0">Hover over the circles for more information</p>
      <p style="margin:0; font-size:12px;">Note: Data points outside the bangalore urban region have been filtered out.</p>
      <div class="obsMapContainer">${createObservationMap({
      blrMap,
      width: obsContainer,
      height: 800,
      data: birdTableMapData,
      color: birdColor,
      longitudeField: "LONGITUDE",
      latitudeField: "LATITUDE",
      tooltipFields: {
    "Common Name": "COMMON.NAME",
    "Locality": "LOCALITY",
    "Ward": "name_en"
  }
    })}</div>
    </div>
    <div class="card">
      <div class="barChartCard">${createMonthlyBarChart(birds, "OBSERVATION.DATE", chartWidth, '#6F73D2', 'Bird seasonal patterns 1979 to 2025', 350)}</div>
    </div>
    <div class="card">
      <p style="margin:0 0 2px 0; font-size:20px; font-weight:bold;">Birds' observation detailed table</p>
      <p style="margin:0 0 0 0;">Select multiple row to see the observation on map or use search bar below table to see observations on map</p>
      <br>
      <div>${birdTable}</div>
      <br>
      <br>
      <div>${birdSearch}</div>
    </div>
</div>


---

## Moths and Butterflies analysis

```js
const mothAndButterflySearch = Inputs.search(filteredMothsAndButterflies_wards, {
  placeholder: "Search moths and butterflies by name, ward...",
});

const mothAndButterflySearchGenerator = Generators.input(mothAndButterflySearch)
```

```js
const mothAndButterflyTable = Inputs.table(mothAndButterflySearchGenerator, {
  columns: ["observed_on","common_name", "scientific_name", "name_en", "latitude", "longitude"], 
  header: {
    "observed_on": "Date",
    "common_name": "Common name",
    "scientific_name": "Scientific name",
    "name_en": "Ward name",
    "latitude": "Latitude",
    "longitude": "Longitude",
  }
});

const mothAndButterflyTableMapData = Generators.input(mothAndButterflyTable);
```

<div class="grid grid-cols-2">
    <div class="grid-rowspan-2">
      <h3>Moth and butterfly observation map (${getYearRange(mothAndButterflyTableMapData, "observed_on", d3).min} to ${getYearRange(mothAndButterflyTableMapData, "observed_on", d3).max})</h3>
      <p style="margin:0">Hover over the circles for more information</p>
      <p style="margin:0; font-size:12px;">Note: Data points outside the bangalore urban region have been filtered out.</p>
      <div class="obsMapContainer">${createObservationMap({
      blrMap,
      width: obsContainer,
      height: 800,
      data: mothAndButterflyTableMapData,
      color: mothAndButterflyColor,
      longitudeField: "longitude",
      latitudeField: "latitude",
      tooltipFields: {
    "Common Name": "common_name",
    "Scientific Name": "scientific_name",
    "Ward": "name_en"
  }
    })}</div>
    </div>
    <div class="card">
      <div class="barChartCard">${createMonthlyBarChart(moths_and_butterflies, "observed_on", chartWidth, mothAndButterflyColor, 'Moth and Butterfly seasonal patterns 2001 to 2025', 350)}</div>
    </div>
    <div class="card">
      <p style="margin:0 0 2px 0; font-size:20px; font-weight:bold;">Moths and Butterflies observation detailed table</p>
      <p style="margin:0 0 0 0;">Select multiple row to see the observation on map or use search bar below table to see observations on map</p>
      <br>
      <div>${mothAndButterflyTable}</div>
      <br>
      <br>
      <div>${mothAndButterflySearch}</div>
    </div>
</div>

---

## Bees analysis


```js
const beeSearch = Inputs.search(filteredBees_wards, {
  placeholder: "Search bees by name, ward...",
});

const beeSearchGenerator = Generators.input(beeSearch)
```

```js
const beeTable = Inputs.table(beeSearchGenerator, {
  columns: ["observed_on","common_name", "scientific_name", "name_en", "latitude", "longitude"], 
  header: {
    "observed_on": "Date",
    "common_name": "Common name",
    "scientific_name": "Scientific name",
    "name_en": "Ward name",
    "latitude": "Latitude",
    "longitude": "Longitude",
  }
});

const beeTableMapData = Generators.input(beeTable);
```


<div class="grid grid-cols-2">
    <div class="grid-rowspan-2">
      <h3>Bee observation map (${getYearRange(beeTableMapData, "observed_on", d3).min} to ${getYearRange(beeTableMapData, "observed_on", d3).max})</h3>
      <p style="margin:0">Hover over the circles for more information</p>
      <p style="margin:0; font-size:12px;">Note: Data points outside the bangalore urban region have been filtered out.</p>
      <div class="obsMapContainer">${createObservationMap({
      blrMap,
      width: obsContainer,
      height: 800,
      data: beeTableMapData,
      color: beeColor,
      longitudeField: "longitude",
      latitudeField: "latitude",
      tooltipFields: {
    "Common Name": "common_name",
    "Scientific Name": "scientific_name",
    "Ward": "name_en"
  }
    })}</div>
    </div>
    <div class="card">
      <div class="barChartCard">${createMonthlyBarChart(filteredBees, "observed_on", chartWidth, beeColor, 'Bee seasonal patterns 2005 to 2025', 350)}</div>
    </div>
    <div class="card">
      <p style="margin:0 0 2px 0; font-size:20px; font-weight:bold;">Bees observation detailed table</p>
      <p style="margin:0 0 0 0;">Select multiple row to see the observation on map or use search bar below table to see observations on map</p>
      <br>
      <div>${beeTable}</div>
      <br>
      <br>
      <div>${beeSearch}</div>
    </div>
</div>

---

## Wasps analysis


```js
const waspSearch = Inputs.search(filteredWasps_wards, {
  placeholder: "Search bees by name, ward...",
});

const waspSearchGenerator = Generators.input(waspSearch)
```

```js
const waspTable = Inputs.table(waspSearchGenerator, {
  columns: ["observed_on","common_name", "scientific_name", "name_en", "latitude", "longitude"], 
  header: {
    "observed_on": "Date",
    "common_name": "Common name",
    "scientific_name": "Scientific name",
    "name_en": "Ward name",
    "latitude": "Latitude",
    "longitude": "Longitude",
  }
});

const waspTableMapData = Generators.input(waspTable);
```

<div class="grid grid-cols-2">
    <div class="grid-rowspan-2">
      <h3>Wasp observation map (${getYearRange(waspTableMapData, "observed_on", d3).min} to ${getYearRange(waspTableMapData, "observed_on", d3).max})</h3>
      <p style="margin:0">Hover over the circles for more information</p>
      <p style="margin:0; font-size:12px;">Note: Data points outside the bangalore urban region have been filtered out.</p>
      <div class="obsMapContainer">${createObservationMap({
      blrMap,
      width: obsContainer,
      height: 800,
      data: waspTableMapData,
      color: waspColor,
      longitudeField: "longitude",
      latitudeField: "latitude",
      tooltipFields: {
    "Common Name": "common_name",
    "Scientific Name": "scientific_name",
    "Ward": "name_en"
  }
    })}</div>
    </div>
    <div class="card">
      <div class="barChartCard">${createMonthlyBarChart(wasps, "observed_on", chartWidth, waspColor, 'Wasp seasonal patterns 2007 to 2025', 350)}</div>
    </div>
    <div class="card">
      <p style="margin:0 0 2px 0; font-size:20px; font-weight:bold;">Wasps observation detailed table</p>
      <p style="margin:0 0 0 0;">Select multiple row to see the observation on map or use search bar below table to see observations on map</p>
      <br>
      <div>${waspTable}</div>
      <br>
      <br>
      <div>${waspSearch}</div>
    </div>
</div>

---

## Bengaluru urban ward wise analysis

Ward wise analysis of pollinators. The ward maps below are ordered with most observations of pollinators to least. Use the search option below to search for ward names, if it takes too long to scroll or find a ward map data.


<br>

```js
function createWardMap({
  wardFeature,
  width = 300,
  height = 300,
  data = [],
  dataConfig = []
}) {
  const projection = d3.geoMercator().fitSize([width, height], wardFeature);
  const path = d3.geoPath(projection);
  
  const createTooltip = (d, fields) => {
    if (!fields || Object.keys(fields).length === 0) {
      return '<div style="padding: 5px;"><p>No data</p></div>';
    }
    const rows = Object.entries(fields)
      .map(([label, field]) => `<p><strong>${label}:</strong> ${d[field] || 'N/A'}</p>`)
      .join('');
    return `<div style="padding: 5px;">${rows}</div>`;
  };

  const svg = htl.svg`<svg width="${width}" height="${height}">
    <g>
      ${htl.svg`<path d="${path(wardFeature)}" stroke="gray" fill="white" stroke-width="1.5"></path>`}
    </g>
    ${dataConfig.map(config => htl.svg`<g>
      ${config.data.map(d => {
        const coords = projection([d[config.longitudeField], d[config.latitudeField]]);
        if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return '';
        return htl.svg`<circle 
          cx="${coords[0]}" 
          cy="${coords[1]}" 
          r="${config.radius || 3}" 
          fill="${config.color}" 
          opacity="${config.opacity || 0.6}"
          style="cursor: pointer;"
          data-tippy-content="${createTooltip(d, config.tooltipFields).replace(/"/g, '&quot;')}">
        </circle>`;
      })}
    </g>`)}
  </svg>`;
  
  setTimeout(() => {
    tippy(svg.querySelectorAll('circle[data-tippy-content]'), {
      allowHTML: true,
      theme: "custom",
      arrow: true,
      placement: "top"
    });
  }, 100);
  
  return svg;
}
```


```js
const wardCardHeight = 250;
```

```js
const allWardsData = wardNames
    .map(wardName => {
      const wardFeature = blrMap.features.find(f => f.properties.name_en === wardName);
      const wardBirds = filteredBirds_wards.filter(d => d.name_en === wardName);
      const wardMoths = filteredMothsAndButterflies_wards.filter(d => d.name_en === wardName);
      const wardBees = filteredBees_wards.filter(d => d.name_en === wardName);
      const wardWasps = filteredWasps_wards.filter(d => d.name_en === wardName);
      
      const totalObs = wardBirds.length + wardMoths.length + wardBees.length + wardWasps.length;
      
      return {
        wardName,
        wardFeature,
        wardBirds,
        wardMoths,
        wardBees,
        wardWasps,
        totalObs
      };
    })
    .sort((a, b) => b.totalObs - a.totalObs);
```

```js
const wardSearchInput = Inputs.search(allWardsData, {
  placeholder: "Search wards by name..."
});

const filteredWards = Generators.input(wardSearchInput);
```

<div style="margin-bottom: 20px;">${wardSearchInput}</div>



```js
html`<div class="grid grid-cols-4">
  ${filteredWards
    .map(ward => {
      const cardWidth = resize((width) => {
        const effectiveWidth = Math.max(250, width - 40); // Account for card padding
        return html`<div class="card">
          <h2 style="font-size: 14px; margin-bottom: 5px;">${ward.wardName}</h2>
          <p style="font-size: 11px; color: #666; margin-bottom: 10px;">${ward.totalObs.toLocaleString()} observations</p>
          ${createWardMap({
            wardFeature: ward.wardFeature,
            width: effectiveWidth,
            height: wardCardHeight,
            dataConfig: [
              {
                data: ward.wardBirds,
                color: birdColor,
                longitudeField: "LONGITUDE",
                latitudeField: "LATITUDE",
                radius: 3,
                opacity: 0.5,
                tooltipFields: { "Species": "COMMON.NAME", "Locality": "LOCALITY" }
              },
              {
                data: ward.wardMoths,
                color: mothAndButterflyColor,
                longitudeField: "longitude",
                latitudeField: "latitude",
                radius: 3,
                opacity: 0.5,
                tooltipFields: { "Species": "common_name", "Date": "observed_on" }
              },
              {
                data: ward.wardBees,
                color: beeColor,
                longitudeField: "longitude",
                latitudeField: "latitude",
                radius: 3,
                opacity: 0.5,
                tooltipFields: { "Species": "common_name", "Date": "observed_on" }
              },
              {
                data: ward.wardWasps,
                color: waspColor,
                longitudeField: "longitude",
                latitudeField: "latitude",
                radius: 3,
                opacity: 0.5,
                tooltipFields: { "Species": "common_name", "Date": "observed_on" }
              }
            ]
          })}
          <hr>
          <br>
          <div>${createMonthlyBarChart(ward.wardBirds, "OBSERVATION.DATE", width, '#6F73D2', `Bird seasonal patterns ${getYearRange(ward.wardBirds, "OBSERVATION.DATE", d3).min} to ${getYearRange(ward.wardBirds, "OBSERVATION.DATE", d3).max}`, 150)}</div><br>
          <div>${createMonthlyBarChart(ward.wardMoths, "observed_on", width, mothAndButterflyColor, `Moth and Butterfly seasonal patterns ${getYearRange(ward.wardMoths, "observed_on", d3).min} to ${getYearRange(ward.wardMoths, "observed_on", d3).max}`, 150)}</div><br>
          <div>${createMonthlyBarChart(ward.wardBees, "observed_on", width, beeColor, `Bee seasonal patterns ${getYearRange(ward.wardBees, "observed_on", d3).min} to ${getYearRange(ward.wardBees, "observed_on", d3).max}`, 150)}</div><br>
          <div>${createMonthlyBarChart(ward.wardWasps, "observed_on", width, waspColor, `Wasp seasonal patterns ${getYearRange(ward.wardWasps, "observed_on", d3).min} to ${getYearRange(ward.wardWasps, "observed_on", d3).max}`, 150)}</div>
        </div>`;
      });
      return cardWidth;
    })}
</div>`
```


<style>
    
      h1, h2, h3, h4, h5, h6, li, p, text, span {
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
