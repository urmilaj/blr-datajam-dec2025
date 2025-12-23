---
title: Pollinators
theme: [dashboard, light]
---

```js
import tippy from "tippy.js";
```

```js
const blr = await FileAttachment("./data/blr-topo.json").json()

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
const filteredBirds_wards = bird_wards.filter(d=>d.name_en !== "");

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





