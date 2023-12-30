import * as utils from "./utils.js";

    const width = 928;
    const height = Math.min(width, 800);
    const tau = 2 * Math.PI;

export function cookPieChart(input) {
    const inputArray = input.transaction

    const data = [];

    inputArray.forEach(({ amount, object }) => {
        data.push({
            name: object.name,
            value: amount,
        });
    });
    
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())
    
    // Create the pie layout and arc generator.
    const pie = d3.pie()
        .sort(null)
        .value(d => d.value);
    
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2 - 1);
    
    const labelRadius = arc.outerRadius()() * 0.8;
    
    // A separate arc generator for labels.
    const arcLabel = d3.arc()
        .innerRadius(labelRadius)
        .outerRadius(labelRadius);
    
    const arcs = pie(data);
    
    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");
    
    // Add a sector path for each value.
    svg.append("g")
        .attr("stroke", "white")
      .selectAll()
      .data(arcs)
      .join("path")
        .attr("fill", d => color(d.data.name))
        .attr("d", arc)
      .append("title")
    
    // Create a new arc generator to place a label close to the edge.
    // The label shows the value if there is enough room.
    svg.append("g")
        .attr("text-anchor", "middle")
      .selectAll()
      .data(arcs)
      .join("text")
        .attr("transform", function(d) { return "translate(" + arcLabel.centroid(d) + ") rotate(" + ((d.startAngle + d.endAngle) * 180 / tau - 90) + ")"; })
        .call(text => text.append("tspan")
            .attr("x", "-7em")
            .attr("y", "0em")
            .attr("font-weight", "bold")
            .text(d => d.data.name))
        .call(text => text.append("tspan")
            .attr("x", "5em")
            .attr("y", "0em")
            .attr("fill-opacity", 1.0)
            .attr("font-weight", "bold")
            .text(d => utils.formatBytes(d.data.value)));
    
document.querySelector(".svgs").appendChild(svg.node());
}