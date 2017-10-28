/*
	System Driver
	Author : Hanfei Lin
	Date: 10/14/2017
*/

var mainview = vis.mainview();
var overview = vis.overview();
var vview = vis.vview();
var hview = vis.hview();

// layout UI and setup events
$(document).ready(function() {
	// init data list
	$.get("/list", function(d) {
		$("#dataset").empty();
		d = $.parseJSON(d);
		d.forEach(function(name) {
			$("#dataset").append(
				"<option>" + name + "</option>"
			);
		});

		var dataUrl = "data/" + $('#dataset').val() + ".txt";
		display(dataUrl);
	});

	$("#tabs").tabs();
	$("#tablists").tabs();

	wire_views();
});

//////////////////////////////////////////////////////////////////////
// local functions

function display(url) {
	// clean contents
	d3.select("#mainview").selectAll("*").remove();
	d3.select("#hview").selectAll("*").remove();
	d3.select("#overview").selectAll("*").remove();

	// load datasets
	var data = $('#dataset').val();
	if(!data || data == '') {
		return;
	}

	d3.json(url, function(error, json) {
		if (error) {
			console.log(error)
			return;
		}

		hview.container(d3.select("#hview")).data(json.source).layout().render();
		mainview.container(d3.select("#mainview")).data(json.graph).layout().render();
		overview.container(d3.select("#overview")).data(json.graph).layout().render();

	});
};

function wire_views(){

	//overview
	overview.dispatch.on('mouseover', function(group) {
			mainview.showGroup(group, true);
	});

	overview.dispatch.on('mouseout', function(group) {
			mainview.showGroup(group, false);
	});

	overview.dispatch.on('select', function(selected) {

			console.log(selected);

			var groupUrl = "group/" + selected;
	d3.json(groupUrl, function(error, json) {console.log(json)});
			// display(groupUrl);

	});

}
