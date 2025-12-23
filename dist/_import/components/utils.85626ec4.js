import * as d3 from "../../_npm/d3@7.9.0/e780feca.js";
import * as Plot from "../../_npm/@observablehq/plot@0.6.17/d761ef9b.js";
import * as topojson from "../../_npm/topojson-client@3.1.0/edd9ee95.js";
import tippy from "../../_node/tippy.js@6.3.7/index.00c267a1.js";
import * as htl from "../../_npm/htl@0.3.1/72f4716c.js";

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

export function createSparklineChart(data, dateField, width, color, title = "Annual observation trends") {
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
  
  const sparklineData = [];
  for (let year = minYear; year <= maxYear; year++) {
    sparklineData.push({
      year: year,
      yearShort: String(year).slice(-2),
      count: yearCounts.get(year) || 0
    });
  }
  
  const peakData = sparklineData.reduce((max, curr) => curr.count > max.count ? curr : max);
  
  const startYear = sparklineData[0];
  const endYear = sparklineData[sparklineData.length - 1];
  
  return Plot.plot({
    caption: title,
    marks: [
      Plot.ruleX([startYear.year], {stroke: "lightgray", strokeWidth: 0.5, opacity: 1}),
      Plot.ruleX([endYear.year], { stroke: "lightgray", strokeWidth: 0.5, opacity: 1 }),
      Plot.lineY(sparklineData, {x: "year", y: "count", stroke: color, strokeWidth: 2.5}),
      Plot.dot([peakData], {x: "year", y: "count", r: 4, fill: color, stroke: "white", strokeWidth: 1.2}),
      Plot.text([peakData], {x: "year", y: "count", text: d => `${d.count.toLocaleString()} observations in ${d.year}`, dy: -11, fontSize: 12, fill: "#212121"}),
      Plot.text([startYear], {x: "year", y: 0, text: d => String(d.year), dx:-3, dy: 8, fontSize: 9, fill: "gray", textAnchor: "start"}),
      Plot.text([endYear], {x: "year", y: 0, text: d => String(d.year), dy: 8, fontSize: 9, fill: "gray", textAnchor: "middle"})
    ],
    width: 180, 
    height: 80, 
    marginTop: 20, 
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 0,
    x: {axis: null}, 
    y: {axis: null},
    style: {
      fontSize: "10px"
    }
  }); 
}

export function getMonthlyObservationCounts(data, dateField) {
  const parseDate = d3.timeParse("%Y-%m-%d");
  
  const validData = data.filter(d => {
    const hasValidDate = d[dateField];
    const isResearchGrade = !d.quality_grade || d.quality_grade === 'research';
    return hasValidDate && isResearchGrade;
  });
  
  if (validData.length === 0) return [];
  
  const monthCounts = d3.rollup(
    validData,
    v => v.length,
    d => {
      const date = parseDate(d[dateField]);
      return date ? date.getMonth() + 1 : null;
    }
  );
  
  
  monthCounts.delete(null);
  
  
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const monthlyData = [];
  for (let month = 1; month <= 12; month++) {
    monthlyData.push({
      month: month,
      monthName: monthNames[month - 1],
      count: monthCounts.get(month) || 0,
      angle: ((month - 1) * 30) - 90,
      normalizedCount: 0 
    });
  }
  
  const maxCount = d3.max(monthlyData, d => d.count);
  if (maxCount > 0) {
    monthlyData.forEach(d => {
      d.normalizedCount = d.count / maxCount;
    });
  }
  
  return monthlyData;
}

export function createMonthlyBarChart(data, dateField, width, color, title = "Seasonal observation patterns", height = 350, margins = {}) {
  const monthlyData = getMonthlyObservationCounts(data, dateField);
  
  if (monthlyData.length === 0 || monthlyData.every(d => d.count === 0)) {
    return htl.html`<div style="width: 200px; height: ${height}px; margin:auto; display: flex; align-items: center; justify-content: center; border: 1px solid #e0e0e0; border-radius: 4px; background-color: #f9f9f9;">
      <p style="color: #999; font-size: 14px; margin: auto; text-align:center;">No observations</p>
    </div>`;
  }

  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Default margins with override option
  const defaultMargins = {
    marginBottom: 40,
    marginTop: 30,
    marginLeft: 30,
    marginRight: 10
  };
  const finalMargins = { ...defaultMargins, ...margins };

  return Plot.plot({
    subtitle: title,
    width: width || 300,
    height: height,
    marginBottom: finalMargins.marginBottom,
    marginTop: finalMargins.marginTop,
    marginLeft: finalMargins.marginLeft,
    marginRight: finalMargins.marginRight,
    marks: [
      Plot.barY(monthlyData, {
        x: "monthName", 
        y: "count", 
        fill: color,
        fillOpacity: 0.8,
        stroke: color,
        strokeWidth: 1,
        tip: true
      }),
      Plot.text(monthlyData, {
        x: "monthName",
        y: "count",
        text: d => d.count > 0 ? d.count.toLocaleString() : "",
        dy: -8,
        fontSize: 10,
        fill: "black",
        textAnchor: "middle"
      })
    ],
    x: {
      label: "Month",
      domain: monthOrder,
      tickRotate: 0,
    },
    y: {
      label: "Observations",
      grid: true
    },
    style: {
      fontSize: "12px"
    }
  });
}

export function createObservationMap({
  blrMap,
  width,
  height,
  data = [],
  color = "#6F73D2",
  longitudeField = "longitude",
  latitudeField = "latitude",
  tooltipFields = {}
}) {
  const projection = d3.geoMercator().fitSize([width, height], blrMap);
  const path = d3.geoPath(projection);

  const createTooltip = (d) => {
    if (Object.keys(tooltipFields).length === 0) {
      return `<div style="margin: 10px">
        <p><strong>Coordinates:</strong></p>
        <p>${d[longitudeField]}, ${d[latitudeField]}</p>
      </div>`;
    }
    
    const rows = Object.entries(tooltipFields)
      .map(([label, field]) => `<p><strong>${label}:</strong> ${d[field] || 'N/A'}</p>`)
      .join('');
    
    return `<div style="margin: 10px;">${rows}</div>`;
  };
  
  const svg = htl.svg`<svg width="${width}" height="${height}">
    <g>
      ${blrMap.features.map(feature => htl.svg`
        <path d="${path(feature)}" stroke="gray" fill="white"></path>
      `)}
    </g>
    <g>
      ${data.map(d => {
        const [x, y] = projection([d[longitudeField], d[latitudeField]]);
        return htl.svg`<circle 
          cx="${x}" 
          cy="${y}" 
          r="4" 
          fill="${color}" 
          opacity="0.5" 
          style="cursor: pointer;"
          data-tippy-content="${createTooltip(d).replace(/"/g, '&quot;')}">
        </circle>`;
      })}
    </g>
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