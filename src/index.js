// This template uses d3-selection and d3-transition
// Importing d3-transition adds the .transition() method to selections
import { select } from "d3-selection";
import "d3-transition";
import Popup from "@flourish/popup";

// Anything the end user can configure in the settings panel must be in
// this object. The settings in template.yml reference these property names.
export var state = {
	color: "#3399CC",
	opacity: 0.5
};

export var data = {};

var w, h, svg, popup = Popup();

// Initialise the graphic
export function draw() {
	// Append and style elements based on the current state
	w = window.innerWidth,
		h = window.innerHeight;

	svg = select(document.body)
		.append("svg")
			.attr("width", w)
			.attr("height", h)
		.on("click", function () { popup.hide(); });

	update();
}

// For non-fluid visualisations, e.g. where an SVG is drawn to fill the available space,
// it may be useful to redraw the visualisation when the window size changes.
window.addEventListener("resize", function() {
	select("svg").remove();
	draw();
});

// The update function is called when the user changes a state property in
// the settings panel or presentation editor. It updates elements to reflect
// the current state.
export function update() {
	if (state.radius <= 0) throw new Error("Radius must be positive");

	// Bind data to the circles
	var circles = svg.selectAll("circle")
		.data(data.circles);

	// Create circles for the data bindings
	circles.enter().append("circle")
		.call(setAttributes);

	circles.transition().call(setAttributes);

	circles.enter().append("circle")
		.on("click", function (d) {
			popup.point(d.x * w, d.y * h).html(d.word).draw();
			event.stopPropagation();
		})
		.call(setAttributes);

	circles.exit().remove();
}

function setAttributes(selection_or_transition) {
	selection_or_transition
		.attr("fill", state.color)
		.attr("opacity", state.opacity)
		.attr("cx", function (d) { return d.x * w; })
		.attr("cy", function (d) { return d.y * h; })
		.transition()
			.duration(1000)
		.attr("r", function (d) { return Math.sqrt(d.size); });
}