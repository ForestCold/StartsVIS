/*
	Generate class dependencies graph
	Author : Hanfei Lin
	Date: 10/14/2017
*/

vis.mainview = function() {

  var mainview = {},
    container = null,
    data = null,
    size = [
      960, 800
    ],
    margin = {
      left: 10,
      top: 10,
      right: 10,
      bottom: 10
    },
    dispatch = d3.dispatch("select", "mouseover", "mouseout");

  mainview.container = function(_) {
    if (!arguments.length)
      return container;
    container = _;
    return mainview;
  };

  mainview.data = function(_) {
    if (!arguments.length)
      return data;
    data = _;
    return mainview;
  };

  mainview.dispatch = dispatch;

  ///////////////////////////////////////////////////
  // Private Parameters
  var nodes = [],
    links = [],
    selected = [];
  simulation = null,
  color = null;

  ///////////////////////////////////////////////////
  // Public Function
  mainview.layout = function() {

    size[0] = parseInt(container.style("width"));
    size[1] = parseInt(container.style("height"));

    for (var i = 0; i < data.nodes.length; i++) {
      selected[data.nodes[i].id] = false;
    }

    return mainview;
  };

  mainview.render = function() {

    //init
    simulation = d3.forceSimulation().force("link", d3.forceLink().id(function(d) {
      return d.id;
    })).force("charge", d3.forceManyBody()).force("center", d3.forceCenter(size[0] / 2, size[1] / 2));

    color = d3.scaleOrdinal(d3.schemeCategory20).domain(d3.range(1, 16));

    var zoom = d3.zoom().scaleExtent([1, 10]).on("zoom", zoomed);

    var graph = container.append("svg").style("width", size[0]).style("height", size[1]).style("margin-left", margin.left).style("margin-top", margin.top)

    function zoomed() {
      graph.attr("transform", "translate(" + d3.event.transform.x + ',' + d3.event.transform.y + ")scale(" + d3.event.transform.k + ")");
    }

    container.call(zoom).call(d3.drag());

    //draw links
    link = graph.append("g").attr("class", "links").selectAll("line").data(data.links).enter().append("line").attr("id", function(d) {
      return "l" + d.id;
    }).attr("stroke-width", function(d) {
      return Math.sqrt(1);
    }).attr("stroke", function(d) {
      if (d.type == "virtual") {
        return "#6D9AD2";
      }
      return "#999";
    })

    //draw nodes
    node = graph.append("g").selectAll("g").attr("class", "gNode").data(data.nodes).enter().append("g").attr("class", function(d) {
      if (d.type === "test") {
        return "rectN";
      } else {
        return "circleN";
      }
    })

    var label = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

    var circles = container.selectAll(".circleN").append("circle").attr("class", "classNode").attr("id", function(d) {
      return "c" + d.id;
    }).attr("r", function(d) {
			if (d.type == "library"){
				return Math.sqrt(d.size) / 1.5;
			}
      return Math.sqrt(d.size);
    }).attr("fill", function(d) {
      return color(d.group.id);
    });

    var rects = container.selectAll(".rectN").append("rect").attr("class", "classNode").attr("id", function(d) {
      return "c" + d.id;
    }).attr("height", function(d) {
      return Math.sqrt(d.size) * 5;
    }).attr("width", function(d){
			return Math.sqrt(d.size) * 5;
		}).attr("fill", function(d) {
      return color(d.group.id);
    });

    d3.selectAll(".classNode").on("mouseover", function(d) {

      //add tooltip to show the class name
      label.transition().duration(200).style("opacity", .9)

      label.html(d.value).style("left", (d3.event.pageX) + 10 + "px").style("top", (d3.event.pageY) + "px");

      d3.selectAll("line").classed("unHighlightLinks", true);
      d3.selectAll("circle").classed("classNodeUnlight", true);
			d3.selectAll("rect").classed("classNodeUnlight", true);

      for (i in selected) {
        if (selected[i]) {
          highlight(i, true);
        }
      }

      highlight(d.id, true);

    }).on("mouseout", function(d) {

      //remove tooltip
      label.transition().duration(500).style("opacity", 0);

      if (!selected[d.id]) {
        highlight(d.id, false);
      }

      for (i in selected) {
        if (selected[i]) {
          highlight(i, true);
        }
      }

    }).on("click", function(d) {

      var flag = selected[d.id];

      for (i in selected) {
        selected[i] = false;
      }

      highlight(-1, false);

      flag
        ? selected[d.id] = false
        : selected[d.id] = true;

      if (selected[d.id]) {
        highlight(d.id, true);
      } else {
        highlight(d.id, false);
      }

      dispatch.call("select", this, d, selected[d.id]);
    }).call(d3.drag().on("start", dragstartedNode).on("drag", draggedNode).on("end", dragendedNode));

    //animation
    simulation.nodes(data.nodes).on("tick", ticked);

    simulation.force("link").links(data.links);

    function ticked() {
      link.attr("x1", function(d) {
        return d.source.x;
      }).attr("y1", function(d) {
        return d.source.y;
      }).attr("x2", function(d) {
        return d.target.x;
      }).attr("y2", function(d) {
        return d.target.y;
      });

      node.attr("transform", function(d) {
				if (d.type == "test"){
					return "translate(" + (d.x -  Math.sqrt(d.size) * 5 / 2) + "," + (d.y -  Math.sqrt(d.size) * 5 / 2) + ")";
				}
        return "translate(" + d.x + "," + d.y + ")";
      })
    }

    function dragstartedNode(d) {
      if (!d3.event.active)
        simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function draggedNode(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragendedNode(d) {
      if (!d3.event.active)
        simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return mainview.update();
  };

  mainview.update = function() {

    return mainview;
  };

  mainview.select = function(className) {

    var d = null;

    console.log(data.nodes[0])

    for (var i = 0; i < data.nodes.length; i++) {
      if (data.nodes[i].value == className) {
        d = data.nodes[i];
      }
    }

    if (d == null) {
      return;
    }

    var flag = selected[d.id];

    for (i in selected) {
      selected[i] = false;
    }

    highlight(-1, false);

    flag
      ? selected[d.id] = false
      : selected[d.id] = true;

    if (selected[d.id]) {
      highlight(d.id, true);
    } else {
      highlight(d.id, false);
    }

    dispatch.call("select", this, d, selected[d.id]);
  }

  mainview.showGroup = function(group, show) {
    if (show) {
      container.selectAll(".classNode").classed("classNodeUnlight", true);
      for (var i = 0; i < group.nodes.length; i++) {
        container.select("#c" + group.nodes[i].id).classed("classNodeUnlight", false);
      }
    } else {
      container.selectAll(".classNode").classed("classNodeUnlight", false);
    }
  };

  ///////////////////////////////////////////////////
  // Private Functions

  function highlight(j, flag) {

    if (!flag) {

      d3.selectAll("line").classed("highlightLinks1", false);
      d3.selectAll("line").classed("highlightLinks2", false);
      d3.selectAll("line").classed("unHighlightLinks", false);
      d3.selectAll("circle").classed("classNodeUnlight", false);
      d3.selectAll("circle").classed("classNodeHightlight", false);
      d3.selectAll("circle").classed("classNodeSelected", false);
			d3.selectAll("rect").classed("classNodeUnlight", false);
			d3.selectAll("rect").classed("classNodeHightlight", false);
			d3.selectAll("rect").classed("classNodeSelected", false);

      if (j != -1) {
        d3.select("#c" + j).classed("classNode", true);
      } else {
        d3.selectAll("circle").classed("classNode", true);
				d3.selectAll("rect").classed("classNode", true);
      }

      return;
    }

    //highlight the circle
    d3.select("#c" + j).classed("classNode", false);
    d3.select("#c" + j).classed("classNodeUnlight", false);
    d3.select("#c" + j).classed("classNodeSelected", true);

    //highlight the links
    for (var i = 0; i < data.links.length; i++) {
      //red: children
      if (data.links[i].source.id == j) {
        d3.select("#l" + data.links[i].id).classed("unHighlightLinks", false);
        d3.select("#l" + data.links[i].id).classed("highlightLinks1", true);
        d3.select("#c" + data.links[i].target.id).classed("classNodeUnlight", false);
        d3.select("#c" + data.links[i].target.id).classed("classNodeHightlight", true);
      }
      //green: fathers
      if (data.links[i].target.id == j) {
        d3.select("#l" + data.links[i].id).classed("unHighlightLinks", false);
        d3.select("#l" + data.links[i].id).classed("highlightLinks2", true);
        d3.select("#c" + data.links[i].source.id).classed("classNodeUnlight", false);
        d3.select("#c" + data.links[i].source.id).classed("classNodeHightlight", true);
      }
    }
  };

  function private_function2() {};

  function private_function3() {};

  return mainview;
};
