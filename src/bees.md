---
title: Bees
theme: [dashboard, light]
toc: false
---


##### Team: Bindu, Ekansh, Sharath, Tanaya, Tullika, Vaibhavi, Urmila
##### Date: December 13, 2025

---

```js
import tippy from "tippy.js";
```

```js
const blr = await FileAttachment("./data/blr-topo.json").json()

const bees = await FileAttachment("./data/bees_research.csv").csv()
const bees_wards = await FileAttachment("./data/bees_research_wards.csv").csv()


import { getYearRange, createObservationMap, createMonthlyBarChart } from "./components/utils.js";
```

```js
const filteredBees = bees;
const filteredBees_wards = bees_wards;

const beeColor = "#EA7317";

const chartWidth = Generators.width(document.querySelector(".barChartCard"));

const blrMap = topojson.feature(blr, blr.objects.blr);
const svgWidth = width;
const svgHeight = 800;
```

```js
const projection = d3.geoMercator().fitSize([svgWidth, svgHeight], blrMap);

const path = d3.geoPath(projection);

const obsContainer = Generators.width(document.querySelector(".obsMapContainer"));
```

# Bees analysis


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