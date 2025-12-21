import * as d3 from "npm:d3";
import * as Plot from "npm:@observablehq/plot";
import * as topojson from "npm:topojson-client";
import { Mutable } from "observablehq:stdlib";
import {html} from "npm:htl";

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
  
  // Filter valid data and extract months
  const validData = data.filter(d => {
    const hasValidDate = d[dateField];
    const isResearchGrade = !d.quality_grade || d.quality_grade === 'research';
    return hasValidDate && isResearchGrade;
  });
  
  if (validData.length === 0) return [];
  
  // Group observations by month (1-12)
  const monthCounts = d3.rollup(
    validData,
    v => v.length,
    d => {
      const date = parseDate(d[dateField]);
      return date ? date.getMonth() + 1 : null; // getMonth() returns 0-11, so add 1 for 1-12
    }
  );
  
  // Remove null months and create array with month names
  monthCounts.delete(null);
  
  // Create complete dataset for all 12 months
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
      // Calculate angle for circular chart (0° = top, clockwise)
      angle: ((month - 1) * 30) - 90, // -90 to start at top instead of right
      // Normalized values for circular chart (0-1)
      normalizedCount: 0 // Will be calculated after we have max value
    });
  }
  
  // Calculate normalized values based on max count
  const maxCount = d3.max(monthlyData, d => d.count);
  if (maxCount > 0) {
    monthlyData.forEach(d => {
      d.normalizedCount = d.count / maxCount;
    });
  }
  
  return monthlyData;
}

export function createMonthlyBarChart(data, dateField, width, color, title = "Seasonal observation patterns") {
  const monthlyData = getMonthlyObservationCounts(data, dateField);
  
  if (monthlyData.length === 0) {
    return Plot.plot({width: width || 300, height: 200});
  }

  // Define month order for proper sequencing
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return Plot.plot({
    subtitle: title,
    width: width || 300,
    height: 250,
    marginBottom: 40,
    marginTop: 30,
    marginLeft: 50,
    marginRight: 10,
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

// export function createInteractiveBarMap(data, dateField, blrTopojson, width = 600, color = "#6366f1", title = "Interactive Seasonal Map") {
//   // Parse and filter data with flexible field names
//   const parseDate = d3.timeParse("%Y-%m-%d");
//   const validData = data.filter(d => {
//     const hasValidDate = d[dateField];
//     // Check for different possible coordinate field names
//     const hasCoords = (d.latitude && d.longitude) || (d.LATITUDE && d.LONGITUDE) || (d.lat && d.lng);
//     const isResearchGrade = !d.quality_grade || d.quality_grade === 'research';
//     return hasValidDate && hasCoords && isResearchGrade;
//   });

//   // Debug: log data info
//   console.log("Total data:", data.length);
//   console.log("Valid data after filtering:", validData.length);
//   console.log("Sample data fields:", Object.keys(data[0] || {}));
  
//   if (validData.length === 0) {
//     return Plot.plot({
//       width, 
//       height: 400, 
//       title: `No valid data found. Total: ${data.length}, Fields: ${Object.keys(data[0] || {}).join(', ')}`
//     });
//   }

//   // Group data by month
//   const monthlyGroups = d3.group(validData, d => {
//     const date = parseDate(d[dateField]);
//     return date ? date.getMonth() + 1 : null;
//   });
  
//   // Remove null months
//   monthlyGroups.delete(null);
  
//   // Create monthly summary data
//   const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   const monthlyData = [];
//   for (let month = 1; month <= 12; month++) {
//     const monthData = monthlyGroups.get(month) || [];
//     monthlyData.push({
//       month: month,
//       monthName: monthNames[month - 1],
//       count: monthData.length,
//       observations: monthData
//     });
//   }

//   // Create reactive state for selected month(s) - Observable pattern
//   const selectedMonths = new Set();
//   const defaultSelection = null;
  
//   // Create container
//   const container = d3.create("div").style("font-family", "sans-serif");
  
//   // Add title
//   container.append("h3").style("margin", "0 0 10px 0").text(title);
  
//   // Function to get current observations based on selection
//   function getCurrentObservations() {
//     if (selectedMonths.size === 0) return validData;
    
//     let filtered = [];
//     for (const month of selectedMonths) {
//       const monthData = monthlyGroups.get(month) || [];
//       filtered = filtered.concat(monthData);
//     }
//     return filtered;
//   }

//   // Create bar chart with brush/selection
//   function createBarChart() {
//     const chart = Plot.plot({
//       title: "Click bars to select months (multiple selection supported)",
//       width: width,
//       height: 200,
//       marginBottom: 40,
//       marginLeft: 60,
//       marks: [
//         Plot.barY(monthlyData, {
//           x: "monthName",
//           y: "count",
//           fill: d => selectedMonths.has(d.month) ? color : "#ddd",
//           fillOpacity: 0.8,
//           stroke: color,
//           strokeWidth: 1,
//           tip: true,
//           title: d => `${d.monthName}: ${d.count} observations`
//         })
//       ],
//       x: {
//         label: "Month",
//         domain: monthNames
//       },
//       y: {
//         label: "Observations",
//         grid: true
//       }
//     });

//     // Add click interactions after chart is created
//     setTimeout(() => {
//       const svg = chart.querySelector("svg");
//       const rects = svg.querySelectorAll("rect[fill]");
      
//       rects.forEach((rect, index) => {
//         rect.style.cursor = "pointer";
//         rect.addEventListener("click", (event) => {
//           // Use the index to find the corresponding month
//           const monthData = monthlyData[index % monthlyData.length];
          
//           if (selectedMonths.has(monthData.month)) {
//             selectedMonths.delete(monthData.month);
//           } else {
//             selectedMonths.add(monthData.month);
//           }
          
//           console.log("Selected months:", Array.from(selectedMonths));
//           updateVisualization();
//         });
//       });
//     }, 100);

//     return chart;
//   }

//   // Create map
//   function createMap(observations) {
//     const mapWidth = width;
//     const mapHeight = 400;
    
//     const svg = d3.create("svg")
//       .attr("width", mapWidth)
//       .attr("height", mapHeight)
//       .style("border", "1px solid #ddd");

//     // Set up projection
//     const blrFeature = topojson.feature(blrTopojson, blrTopojson.objects.blr);
//     const projection = d3.geoMercator().fitSize([mapWidth, mapHeight], blrFeature);
//     const path = d3.geoPath(projection);

//     // Draw boundary
//     svg.append("g")
//       .selectAll("path")
//       .data(blrFeature.features)
//       .enter()
//       .append("path")
//       .attr("d", path)
//       .attr("fill", "#f8f9fa")
//       .attr("stroke", "#ddd")
//       .attr("stroke-width", 1);

//     // Add observation points
//     if (observations.length > 0) {
//       svg.append("g")
//         .selectAll("circle")
//         .data(observations)
//         .enter()
//         .append("circle")
//         .attr("cx", d => {
//           const lon = d.longitude || d.LONGITUDE || d.lng;
//           const lat = d.latitude || d.LATITUDE || d.lat;
//           const coords = projection([+lon, +lat]);
//           return coords ? coords[0] : null;
//         })
//         .attr("cy", d => {
//           const lon = d.longitude || d.LONGITUDE || d.lng;
//           const lat = d.latitude || d.LATITUDE || d.lat;
//           const coords = projection([+lon, +lat]);
//           return coords ? coords[1] : null;
//         })
//         .attr("r", 2)
//         .attr("fill", color)
//         .attr("fill-opacity", 0.7)
//         .attr("stroke", "white")
//         .attr("stroke-width", 0.5);
//     }

//     // Add count label
//     const monthText = selectedMonths.size === 0 ? " (all months)" : 
//                      selectedMonths.size === 1 ? ` in ${monthNames[Array.from(selectedMonths)[0] - 1]}` :
//                      ` in ${selectedMonths.size} selected months`;
    
//     svg.append("text")
//       .attr("x", 20)
//       .attr("y", 30)
//       .style("font-size", "14px")
//       .style("font-weight", "bold")
//       .text(`${observations.length.toLocaleString()} observations${monthText}`);

//     return svg.node();
//   }

//   // Create containers for charts
//   const barContainer = container.append("div").style("margin-bottom", "20px");
//   const mapContainer = container.append("div");

//   // Function to update both visualizations
//   function updateVisualization() {
//     const currentObs = getCurrentObservations();
    
//     // Clear and recreate both charts
//     barContainer.selectAll("*").remove();
//     mapContainer.selectAll("*").remove();
    
//     barContainer.node().appendChild(createBarChart());
//     mapContainer.node().appendChild(createMap(currentObs));
//   }

//   // Initial render
//   updateVisualization();

//   return container.node();
// }

export function getMonthlyObservationsWithData(data, dateField) {
  const parseDate = d3.timeParse("%Y-%m-%d");
  
  // Filter valid data and extract months with coordinate validation
  const validData = data.filter(d => {
    const hasValidDate = d[dateField];
    const isResearchGrade = !d.quality_grade || d.quality_grade === 'research';
    // Check for different possible coordinate field names
    const hasCoords = (d.latitude && d.longitude) || (d.LATITUDE && d.LONGITUDE) || (d.lat && d.lng);
    return hasValidDate && isResearchGrade && hasCoords;
  });
  
  if (validData.length === 0) return [];
  
  // Group observations by month (1-12) and keep the actual data
  const monthlyGroups = d3.group(validData, d => {
    const date = parseDate(d[dateField]);
    return date ? date.getMonth() + 1 : null; // getMonth() returns 0-11, so add 1 for 1-12
  });
  
  // Remove null months
  monthlyGroups.delete(null);
  
  // Create complete dataset for all 12 months
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const monthlyData = [];
  for (let month = 1; month <= 12; month++) {
    const monthObservations = monthlyGroups.get(month) || [];
    monthlyData.push({
      month: month,
      monthName: monthNames[month - 1],
      count: monthObservations.length,
      observations: monthObservations,
    });
  }
  
  // Calculate normalized values based on max count
  // const maxCount = d3.max(monthlyData, d => d.count);
  // if (maxCount > 0) {
  //   monthlyData.forEach(d => {
  //     d.normalizedCount = d.count / maxCount;
  //   });
  // }
  
  return monthlyData;
}

// export function createInteractiveBrushMap(data, dateField, blrTopojson, width = 600, color = "#6366f1", title = "Interactive Seasonal Brush Map") {
//   // Get monthly data with observations
//   const monthlyData = getMonthlyObservationsWithData(data, dateField);
  
//   if (monthlyData.length === 0) {
//     return html`<div>No valid data found for mapping</div>`;
//   }

//   // Create mutable state for selected months (Observable pattern)
//   const selectedMonths = new Set();
//   const state = Mutable(new Set());
  
//   // Function to get current observations based on selection
//   function getCurrentObservations() {
//     if (state.value.size === 0) {
//       // Show all observations if nothing selected
//       return monthlyData.flatMap(d => d.observations);
//     }
    
//     // Show observations from selected months only
//     return monthlyData
//       .filter(d => state.value.has(d.month))
//       .flatMap(d => d.observations);
//   }

//   // Create the bar chart with brush interaction
//   const barChart = Plot.plot({
//     title: title,
//     subtitle: "Click and drag to brush across months, or click individual bars",
//     width: width,
//     height: 200,
//     marginBottom: 40,
//     marginLeft: 60,
//     marginRight: 20,
//     marks: [
//       Plot.barY(monthlyData, {
//         x: "monthName",
//         y: "count",
//         fill: d => state.value.has(d.month) ? color : (state.value.size === 0 ? color : "#ddd"),
//         fillOpacity: 0.8,
//         stroke: color,
//         strokeWidth: 1,
//         tip: true
//       }),
//       // Add brush interaction
//       (index, scales, channels, dimensions, context) => {
//         const x1 = dimensions.marginLeft;
//         const y1 = 0;
//         const x2 = dimensions.width - dimensions.marginRight;
//         const y2 = dimensions.height;
        
//         const brushed = (event) => {
//           if (!event.sourceEvent) return;
//           let {selection} = event;
          
//           if (!selection) {
//             // Single click - toggle individual month
//             const [px] = d3.pointer(event, context.ownerSVGElement);
//             const monthIndex = Math.floor((px - x1) / ((x2 - x1) / 12));
//             if (monthIndex >= 0 && monthIndex < 12) {
//               const month = monthIndex + 1;
//               const newSelection = new Set(state.value);
//               if (newSelection.has(month)) {
//                 newSelection.delete(month);
//               } else {
//                 newSelection.add(month);
//               }
//               state.value = newSelection;
//             }
//             return;
//           }
          
//           // Brush selection - select multiple months
//           const [x0, x1] = selection;
//           const startMonth = Math.floor((x0 - dimensions.marginLeft) / ((x2 - x1) / 12)) + 1;
//           const endMonth = Math.ceil((x1 - dimensions.marginLeft) / ((x2 - x1) / 12));
          
//           const brushedMonths = new Set();
//           for (let month = Math.max(1, startMonth); month <= Math.min(12, endMonth); month++) {
//             brushedMonths.add(month);
//           }
//           state.value = brushedMonths;
//         };

//         const brush = d3.brushX()
//           .extent([[x1, y1], [x2, y2]])
//           .on("brush end", brushed);
          
//         const g = d3.create("svg:g").call(brush);
//         return g.node();
//       }
//     ],
//     x: {
//       label: "Month",
//       domain: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//     },
//     y: {
//       label: "Observations",
//       grid: true
//     }
//   });

//   // Create reactive map that updates when state changes
//   const mapChart = Plot.plot({
//     width: width,
//     height: 400,
//     projection: d3.geoMercator().fitSize([width, 400], topojson.feature(blrTopojson, blrTopojson.objects.blr)),
//     marks: [
//       // Draw Bangalore boundaries
//       Plot.geo(topojson.feature(blrTopojson, blrTopojson.objects.blr), {
//         fill: "#f8f9fa",
//         stroke: "#ddd",
//         strokeWidth: 1
//       }),
//       // Plot observation points - this will be reactive
//       Plot.dot(getCurrentObservations(), {
//         x: d => d.longitude || d.LONGITUDE || d.lng,
//         y: d => d.latitude || d.LATITUDE || d.lat,
//         r: 2,
//         fill: color,
//         fillOpacity: 0.7,
//         stroke: "white",
//         strokeWidth: 0.5,
//         tip: true
//       }),
//       // Add count text
//       Plot.text([{
//         x: width * 0.02,
//         y: 30,
//         text: `${getCurrentObservations().length.toLocaleString()} observations${
//           state.value.size === 0 ? " (all months)" :
//           state.value.size === 1 ? ` in ${monthlyData.find(d => state.value.has(d.month))?.monthName}` :
//           ` in ${state.value.size} selected months`
//         }`
//       }], {
//         x: "x",
//         y: "y",
//         text: "text",
//         fontSize: 14,
//         fontWeight: "bold",
//         fill: "black"
//       })
//     ]
//   });

//   // Return container with both charts
//   return html`
//     <div style="font-family: sans-serif;">
//       <h3 style="margin: 0 0 10px 0;">${title}</h3>
//       ${barChart}
//       <div style="margin-top: 20px;">
//         ${mapChart}
//       </div>
//     </div>
//   `;
// }

export function createInteractiveBrushMap(data, dateField, blrTopojson, width = 600, color = "#6366f1", title = "Interactive Seasonal Brush Map") {
  // Get monthly data with observations
  const monthlyData = getMonthlyObservationsWithData(data, dateField);
  
  if (monthlyData.length === 0) {
    return html`<div>No valid data found for mapping</div>`;
  }

  // Create container
  const container = html`<div style="font-family: sans-serif;"></div>`;
  
  // State for selected months
  let selectedMonths = new Set();
  
  // Function to get current observations based on selection
  function getCurrentObservations() {
    if (selectedMonths.size === 0) {
      return monthlyData.flatMap(d => d.observations);
    }
    return monthlyData
      .filter(d => selectedMonths.has(d.month))
      .flatMap(d => d.observations);
  }

  // Function to update visualizations
  function updateCharts() {
    // Clear container
    container.innerHTML = '';
    
    // Add title
    const titleEl = html`<h3 style="margin: 0 0 10px 0;">${title}</h3>`;
    container.appendChild(titleEl);
    
    // Create bar chart
    const barChart = Plot.plot({
      subtitle: "Click and drag to brush across months, or click individual bars",
      width: width,
      height: 200,
      marginBottom: 40,
      marginLeft: 60,
      marginRight: 20,
      marks: [
        Plot.barY(monthlyData, {
          x: "monthName",
          y: "count",
          fill: d => selectedMonths.has(d.month) ? color : (selectedMonths.size === 0 ? color : "#ddd"),
          fillOpacity: 0.8,
          stroke: color,
          strokeWidth: 1,
          tip: true
        })
      ],
      x: {
        label: "Month",
        domain: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      y: {
        label: "Observations",
        grid: true
      }
    });

    // Add brush interaction after chart is created
    setTimeout(() => {
      const svg = barChart.querySelector("svg");
      if (svg) {
        const chartRect = svg.getBoundingClientRect();
        const margins = {left: 60, right: 20};
        const chartWidth = width - margins.left - margins.right;
        
        // Add brush functionality
        const brush = d3.brushX()
          .extent([[margins.left, 0], [width - margins.right, 200]])
          .on("brush end", (event) => {
            const selection = event.selection;
            
            if (!selection) {
              // Click - toggle individual month
              const [mouseX] = d3.pointer(event, svg);
              const monthIndex = Math.floor((mouseX - margins.left) / (chartWidth / 12));
              if (monthIndex >= 0 && monthIndex < 12) {
                const month = monthIndex + 1;
                if (selectedMonths.has(month)) {
                  selectedMonths.delete(month);
                } else {
                  selectedMonths.add(month);
                }
                updateCharts();
              }
              return;
            }
            
            // Brush selection
            const [x0, x1] = selection;
            const startMonth = Math.floor((x0 - margins.left) / (chartWidth / 12)) + 1;
            const endMonth = Math.ceil((x1 - margins.left) / (chartWidth / 12));
            
            selectedMonths.clear();
            for (let month = Math.max(1, startMonth); month <= Math.min(12, endMonth); month++) {
              selectedMonths.add(month);
            }
            updateCharts();
          });

        d3.select(svg).call(brush);
      }
    }, 100);
    
    container.appendChild(barChart);
    
    // Create map
    const currentObs = getCurrentObservations();
    const mapChart = Plot.plot({
      width: width,
      height: 400,
      projection: d3.geoMercator().fitSize([width, 400], topojson.feature(blrTopojson, blrTopojson.objects.blr)),
      marks: [
        // Draw Bangalore boundaries
        Plot.geo(topojson.feature(blrTopojson, blrTopojson.objects.blr), {
          fill: "#f8f9fa",
          stroke: "#ddd",
          strokeWidth: 1
        }),
        // Plot observation points
        Plot.dot(currentObs, {
          x: d => d.longitude || d.LONGITUDE || d.lng,
          y: d => d.latitude || d.LATITUDE || d.lat,
          r: 2,
          fill: color,
          fillOpacity: 0.7,
          stroke: "white",
          strokeWidth: 0.5,
          tip: true
        }),
        // Add count text
        Plot.text([{
          x: width * 0.02,
          y: 30,
          text: `${currentObs.length.toLocaleString()} observations${
            selectedMonths.size === 0 ? " (all months)" : 
            selectedMonths.size === 1 ? ` in ${monthlyData.find(d => selectedMonths.has(d.month))?.monthName}` :
            ` in ${selectedMonths.size} selected months`
          }`
        }], {
          x: "x",
          y: "y", 
          text: "text",
          fontSize: 14,
          fontWeight: "bold",
          fill: "black"
        })
      ]
    });
    
    const mapContainer = html`<div style="margin-top: 20px;"></div>`;
    mapContainer.appendChild(mapChart);
    container.appendChild(mapContainer);
  }

  // Initial render
  updateCharts();
  
  return container;
}