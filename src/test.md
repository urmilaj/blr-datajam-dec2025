---
title: Test
theme: [dashboard, light]
---

```js
import tippy from "tippy.js";
```

```js
const blr = await FileAttachment("./data/blr-topo.json").json();

const birds = await FileAttachment("./data/birds_combined_upto_2025.csv").csv();
const bird_wards = await FileAttachment("./data/birds_with_wards.csv").csv();

const moths_and_butterflies = await FileAttachment("./data/moths_butterflies_combined_upto_2025.csv").csv();
const mothAndButterflies_wards = await FileAttachment("./data/mothsAndButterflies_with_wards.csv").csv();

const bees = await FileAttachment("./data/bees_combined_upto_2025.csv").csv();
const bees_wards = await FileAttachment("./data/bees_with_wards.csv").csv();

const wasps = await FileAttachment("./data/wasps_combined_upto_2025.csv").csv();
const wasps_wards = await FileAttachment("./data/wasps_with_wards.csv").csv();

import { createMonthlyBarChart } from "./components/utils.js";
```


```js
const filteredBirds_wards = bird_wards.filter(d=>d.name_en !== "");

const filteredMothsAndButterflies = moths_and_butterflies.filter((d) => d.quality_grade === "research")
const filteredMothsAndButterflies_wards = mothAndButterflies_wards.filter((d) => d.quality_grade === "research" && d.name_en !== "");

const filteredBees = bees.filter((d) => d.quality_grade === "research")
const filteredBees_wards = bees_wards.filter((d) => d.quality_grade === "research" && d.name_en !== "");

const filteredWasps = wasps.filter((d) => d.quality_grade === "research")
const filteredWasps_wards = wasps_wards.filter((d) => d.quality_grade === "research" && d.name_en !== "");
```

```js
const mapWidth = 850
const mapHeight = 800;

const birdColor = "#6F73D2";
const mothAndButterflyColor = "#C04ABC";
const beeColor = "#EA7317";
const waspColor = "#A8B25D"
```



```js
const blrMap = topojson.feature(blr, blr.objects.blr);

const projection = d3.geoMercator().fitSize([mapWidth, mapHeight], blrMap);

const path = d3.geoPath(projection)

const obsContainer = Generators.width(document.querySelector(".obsMapContainer"))

const wardContainer = Generators.width(document.querySelector(".obsMapContainer"))
```





```js
const wardNames = blrMap.features.map(f => f.properties.name_en);

const wardWidth = 500;
const wardHeight = 500;
```

<!-- ```js
const selectedWardFeature = blrMap.features.find(f => f.properties.name_en === selectedWard);
const wardProjection = d3.geoMercator().fitSize([wardWidth, wardHeight], selectedWardFeature);
const wardPath = d3.geoPath(wardProjection);

```

```js
svg`<svg width=${wardWidth} height=${wardHeight}>
    <g>
        ${svg`<path d=${wardPath(selectedWardFeature)} stroke="gray" fill="white"/>`}
    </g>
</svg>`
``` -->


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
