document.addEventListener("DOMContentLoaded", () => {
async function Fetch() {
	const res = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json");
	let data = await res.json();
	data = data["data"]
	data.forEach(item => {
		item[0] = new Date(item[0]);
	});
	
	const w = 1000; // canvas width
	const h = 600; // canvas height
	const p = 100; // canvas padding
	
	const svg = d3.select("#container").append("svg").attr("width", w).attr("height", h).style("background-color", "white").attr("id", "svg");
	
	let xScale = d3.scaleLinear().domain([d3.min(data, (d) => d[0]), d3.max(data, (d) => d[0])]).range([p, w - p]);

	let yScale = d3.scaleLinear().domain([0, d3.max(data, (d) => d[1])]).range([h - p, p]);

	svg.selectAll("rect").data(data).enter().append("rect").attr("x", (d) => xScale(d[0])).attr("y", (d) => yScale(d[1])).attr("width", (w - 2 * p) / data.length).attr("height", (d) => h - p - yScale(d[1])).attr("fill", "#298CBC").attr("class", "bar");

	data.forEach(item => {
		item[0] = item[0].getFullYear();
	});

	xScale = d3.scaleLinear().domain([d3.min(data, (d) => d[0]), d3.max(data, (d) => d[0]) + 1]).range([p, w - p]);
	const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
	svg.append("g").attr("transform", `translate(0, ${h - p})`).attr("id", "x-axis").call(xAxis);
	
	const yAxis = d3.axisLeft(yScale);
	svg.append("g").attr("transform", `translate(${p}, 0)`).attr("id", "y-axis").call(yAxis);

	svg.select("div").data(data).enter().append("div").attr("class", "hover").style("margin-left", (d) => `calc(50vw + (${xScale(d[0])}px / 1.1))`);
	
	let t = 0; // for yearly quarters
	for(let i = 0; i < data.length; i++) {
		if(i > 0) {
			if(data[i][0] != data[i - 1][0].split(" ")[0]) {
				t = 0;
			} else if(data[i][0] == data[i - 1][0].split(" ")[0]) {
				t++;
			}
			data[i][0] = `${data[i][0]} Q${t + 1}`;
			data[i][1] = `$${data[i][1]} Billion`;
		} else {
			data[i][0] = `${data[i][0]} Q${t + 1}`;
			data[i][1] = `$${data[i][1]} Billion`;
		}
	}
	
	const bar = Array.from(document.querySelectorAll(".bar"));
	const tooltip = Array.from(document.querySelectorAll(".hover"));

	tooltip.forEach((item, index) => {
		item.innerHTML = `${data[index][0]}<br />${data[index][1]}`;
	});

	bar.forEach((item, index) => {
		item.addEventListener("mouseenter", () => {
			setTimeout(() => {tooltip[index].style.display = "block"}, 200);
			tooltip[index].style.opacity = "80%";
		});
		
		item.addEventListener("mouseleave", () => {
			tooltip[index].style.opacity = "0%";
			setTimeout(() => {tooltip[index].style.display = "none"}, 200);
		});
	});
}
Fetch();
});