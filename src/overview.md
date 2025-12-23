---
title: Overview
theme: [dashboard, light]
---

##### Team: Bindu, Ekansh, Sharath, Tanaya, Tullika, Vaibhavi, Urmila
##### Date: December 13, 2025

---

```js
const birds = await FileAttachment("./data/birds_combined_upto_2025.csv").csv()
const bird_wards = await FileAttachment("./data/birds_with_wards.csv").csv()

const moths_and_butterflies = await FileAttachment("./data/moths_butterflies_research.csv").csv()
const mothAndButterflies_wards = await FileAttachment("./data/moths_butterflies_research_wards.csv").csv()

const bees = await FileAttachment("./data/bees_research.csv").csv()
const bees_wards = await FileAttachment("./data/bees_research_wards.csv").csv()

const wasps = await FileAttachment("./data/wasps_research.csv").csv()
const wasps_wards = await FileAttachment("./data/wasps_research_wards.csv").csv()

import { getYearRange, getUniqueSpeciesCount, createSparklineChart } from "./components/utils.js";
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

const svgWidth = width;
const svgHeight = 800;
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
  
</style>