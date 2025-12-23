---
title: Bengaluru Wards
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

const bird_wards = await FileAttachment("./data/birds_with_wards.csv").csv()

const mothAndButterflies_wards = await FileAttachment("./data/moths_butterflies_research_wards.csv").csv()

const bees_wards = await FileAttachment("./data/bees_research_wards.csv").csv()

const wasps_wards = await FileAttachment("./data/wasps_research_wards.csv").csv()

import { getYearRange, createMonthlyBarChart } from "./components/utils.js";
```

```js
const filteredBirds_wards = bird_wards.filter(d=>d.name_en !== "");
const filteredMothsAndButterflies_wards = mothAndButterflies_wards;
const filteredBees_wards = bees_wards;
const filteredWasps_wards = wasps_wards;

const birdColor = "#6F73D2";
const mothAndButterflyColor = "#C04ABC";
const beeColor = "#EA7317";
const waspColor = "#A8B25D"


const blrMap = topojson.feature(blr, blr.objects.blr);
```

```js
const wardNames = blrMap.features.map(f => f.properties.name_en);

const wardWidth = 500;
const wardHeight = 500;
```

# Bengaluru urban ward wise analysis

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
          <div>${createMonthlyBarChart(ward.wardBirds, "OBSERVATION.DATE", width, '#6F73D2', `Bird seasonal patterns ${getYearRange(ward.wardBirds, "OBSERVATION.DATE", d3).min} to ${getYearRange(ward.wardBirds, "OBSERVATION.DATE", d3).max}`, 150, {marginLeft: 25, marginRight: 0})}</div><br>
          <div>${createMonthlyBarChart(ward.wardMoths, "observed_on", width, mothAndButterflyColor, `Moth and Butterfly seasonal patterns ${getYearRange(ward.wardMoths, "observed_on", d3).min} to ${getYearRange(ward.wardMoths, "observed_on", d3).max}`, 150, {marginLeft: 25, marginRight: 0})}</div><br>
          <div>${createMonthlyBarChart(ward.wardBees, "observed_on", width, beeColor, `Bee seasonal patterns ${getYearRange(ward.wardBees, "observed_on", d3).min} to ${getYearRange(ward.wardBees, "observed_on", d3).max}`, 150, {marginLeft: 25, marginRight: 0})}</div><br>
          <div>${createMonthlyBarChart(ward.wardWasps, "observed_on", width, waspColor, `Wasp seasonal patterns ${getYearRange(ward.wardWasps, "observed_on", d3).min} to ${getYearRange(ward.wardWasps, "observed_on", d3).max}`, 150, {marginLeft: 25, marginRight: 0})}</div>
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