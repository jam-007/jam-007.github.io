import * as utils from "./utils.js";

const margin = ({top: 0, right: 0, bottom: 0, left: 0})
const width = 800 - margin.left - margin.right
const height = 600 - margin.left - margin.right

export function drawLineGraph(input) {

    const inputArray = input.transaction
    const data = [];
    let amtTotal = 0

    inputArray.forEach(({ amount, object, createdAt }) => {
        amtTotal += amount;
        data.push({
            name: object.name,
            value: amtTotal,
            date: new Date (createdAt),
        });
    });
    // console.log('datatest', inputArray)

    const tooltip = d3.select(".svgs")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    const x = d3.scaleUtc()
        .domain(d3.extent(data, d => new Date(d.date)))
        .range([0, width])

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height, 0])

    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value))

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .style("font-size", "24px")
        .call(d3.axisBottom(x).ticks(d3.utcMonth.every(1)).tickFormat(d3.utcFormat("%m")).tickSizeOuter(3))

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .style("font-size", "24px")
        .call(d3.axisLeft(y).tickFormat(d => `${d/1000}`))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("transform", "rotate(-90)")
            .attr("y", + 30)
            .attr("x", -100)
            .attr("text-anchor", "middle") 
            .attr("font-weight", "bold")
            .attr("font-size", "30") 
            .text("xp amount KB"))        // text to write; must be AFTER attr

    const svg = d3
        .create("svg")
        .attr('viewBox', [100, -100, height, width])
        .attr('width', width)
        .attr('height', height + margin.top + margin.bottom)
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.append("text")
        .attr("class", "graph-title")
        .attr("x", width/4)
        .attr("y", margin.top + 20)
        .style("font-size", "40")
        .style("font-weight", "bold")
        .style("fill", "white")
        .text("your xp/date")

    svg.append("text")
        .attr("class", "graph-note")
        .attr("x", width/4)
        .attr("y", margin.top + 50)
        .style("font-size", "26")
        .style("font-weight", "bold")
        .style("fill", "white")
        .text("hover the circles to see details")

    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.value))
        .attr("r", 10)
        .attr("opacity", "0.5")
        .attr("fill", "rgb(22, 23, 24)")
        
        .on("mouseover", function (event, d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0.7) 

            tooltip
                .style("left", (1000) + "px")
                .style("top", (700) + "px")
                .style("display", "block")
                .html(`Date: ${utils.formattedDate(d.date)}<br>Value: ${d.value}<br>Name: ${d.name}`);
            })
            .on("mouseout", d => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0)
                .style("display", "none")
            });

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "chocolate")
        .attr("stroke-width", 3.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line)

    document.querySelector(".svgs").appendChild(svg.node());
}
