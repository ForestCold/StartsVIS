/*
	Generate class dependencies graph
	Author : Hanfei Lin
	Date: 10/14/2017
*/

vis.mainview = function(){

	var mainview = {},
		container = null,
		data = null,
		size = [960, 800],
	 	margin = {left:10, top:10, right:10, bottom:10},
		dispatch = d3.dispatch("select", "mouseover", "mouseout");

	mainview.container = function(_) {
		if (!arguments.length) return container;
		container = _;
		return mainview;
	};

	mainview.data = function(_) {
		if (!arguments.length) return data;
		data = _;
		return mainview;
	};

	mainview.dispatch = dispatch;

	///////////////////////////////////////////////////
	// Private Parameters

	///////////////////////////////////////////////////
	// Public Function
	mainview.layout = function() {

		size[0] = parseInt(container.style("width"));
		size[1] = parseInt(container.style("height"));

		return mainview;
	};

	mainview.render = function() {

		//init
		var simulation = d3.forceSimulation()
    	.force("link", d3.forceLink().id(function(d) { return d.id; }))
    	.force("charge", d3.forceManyBody())
    	.force("center", d3.forceCenter(size[0] / 2, size[1] / 2));

		var color = d3.scaleOrdinal(d3.schemeCategory20).domain(d3.range(1, 16));

		var zoom = d3.zoom()
				.scaleExtent([1, 10])
				.on("zoom", zoomed);

		var graph = container.append("svg")
			.style("width", size[0])
			.style("height", size[1])
			.style("margin-left", margin.left)
			.style("margin-top", margin.top)

		function zoomed() {
			graph.attr("transform", "translate(" + d3.event.transform.x + ',' + d3.event.transform.y + ")scale(" + d3.event.transform.k + ")");
		}

		container.call(zoom)
						 .call(d3.drag());

		//draw links
		var link = graph.append("g")
			.attr("class", "links")
			.selectAll("line")
			.data(data.links)
			.enter().append("line")
			.attr("stroke-width", function(d) { return Math.sqrt(d.value); });

		//draw nodes
		var node = graph.append("g")
			.selectAll("g")
			.data(data.nodes)
			.enter().append("g")

		var label = d3.select("body").append("div")
    	.attr("class", "tooltip")
    	.style("opacity", 0);

		var circles = node.append("circle")
			.attr("class", "classNode")
			.attr("id", function(d){return "c" + d.id;})
      .attr("r", function(d) {return Math.sqrt(d.size);})
      .attr("fill", function(d) {return color(d.group.id);})
			.on("mouseover", function(d) {

				//add tooltip to show the class name
				label.transition()
           .duration(200)
           .style("opacity", .9)

        label.html(d.value)
           .style("left", (d3.event.pageX) + 10 + "px")
           .style("top", (d3.event.pageY) + "px");

				//hightlight the circle
				d3.select(this).classed("classNode", false);
				d3.select(this).classed("classNodeHightlight", true);

			})

			.on("mouseout", function(d){
				//remove tooltip
				label.transition()
						.duration(500)
						.style("opacity", 0);

				d3.select(this).classed("classNode", true);
				d3.select(this).classed("classNodeHightlight", false);
			})
      .call(d3.drag()
          .on("start", dragstartedNode)
          .on("drag", draggedNode)
          .on("end", dragendedNode));

		//animation
		simulation
      .nodes(data.nodes)
      .on("tick", ticked);

  	simulation.force("link")
      .links(data.links);

		function ticked() {
    	link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    	node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
  	}

		function dragstartedNode(d) {
  		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  		d.fx = d.x;
  		d.fy = d.y;
		}

		function draggedNode(d) {
  		d.fx = d3.event.x;
  		d.fy = d3.event.y;
		}

		function dragendedNode(d) {
  		if (!d3.event.active) simulation.alphaTarget(0);
  		d.fx = null;
  		d.fy = null;
		}

		return mainview.update();
	};

	mainview.update = function() {
		return mainview;
	};

	mainview.showGroup = function(group, show){
		if (show){
			container.selectAll(".classNode").classed("classNodeUnlight", true);
			for (var i = 0; i < group.nodes.length; i++){
				container.select("#c" + group.nodes[i].id).classed("classNodeUnlight", false);
			}
		} else {
			container.selectAll(".classNode").classed("classNodeUnlight", false);
		}
	};

	///////////////////////////////////////////////////
	// Private Functions

	function private_function1() {

	};

	function private_function2() {

	};

	function private_function3() {

	};

	return mainview;
};
