/*
	A code template for a visualization lview
	Author : Hanfei Lin
	Date: 10/14/2017
*/

vis.lview = function() {

  var lview = {},
    container = null,
    data = null,
    size = [960, 800],
    margin = {
      left: 10,
      top: 10,
      right: 10,
      bottom: 10,
      middle: 10
    },
    dispatch = d3.dispatch("select", "mouseover", "mouseout");

  lview.container = function(_) {
    if (!arguments.length) return container;
    container = _;
    return lview;
  };

  lview.data = function(_) {
    if (!arguments.length) return data;
    data = _;
    return lview;
  };

  lview.size = function(_) {
    if (!arguments.length) return size;
    size = _;
    return lview;
  };

  lview.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return lview;
  };

  lview.dispatch = dispatch;

  ///////////////////////////////////////////////////
  // Private Parameters
  var selected = []

  ///////////////////////////////////////////////////
  // Public Function
  lview.layout = function() {
    return lview;
  };

  lview.render = function() {

    size[0] = parseInt(container.style("width"));
    size[1] = parseInt(container.style("height"));

    for (var i = 0; i <= 2; i++) {
      selected[i] = false;
    }

    var width = (size[0] - margin.left - margin.right - 20) / 3;
    var height = size[1] - margin.top - margin.bottom;

    var svg = container.append("svg").style("width", size[0]).style("height", size[1]);
    var selection1 = svg.append("g").attr("transform", function(d) {
      return "translate(" + margin.left + "," + margin.top + ")";
    });
    var selection2 = svg.append("g").attr("transform", function(d) {
      return "translate(" + (margin.left + width + margin.middle) + "," + margin.top + ")";
    });
    var selection3 = svg.append("g").attr("transform", function(d) {
      return "translate(" + (size[0] - margin.right - width) + "," + margin.top + ")";
    });

    selection1.append("rect")
      .attr("id", "test")
      .style("width", width)
      .style("height", height)
      .style("fill", "#AED2F0")
      .style("opacity", 0.3)
      .on("mouseover", function() {
        d3.select(this).style("opacity", 0.8);
        dispatch.call("mouseover", this, "test");
      }).on("mouseout", function() {
        d3.select(this).style("opacity", 0.3);
        dispatch.call("mouseout", this, "test");
      }).on("click", function() {
        selected[0] = selected[0] ? false : true;
        d3.select(this).classed("selectedType", selected[0]);
        dispatch.call("select", this, calSelected());
      })

    selection2.append("rect")
      .attr("id", "class")
      .style("width", width)
      .style("height", height)
      .style("fill", "#EBC441")
      .style("opacity", 0.3)
      .on("mouseover", function() {
        d3.select(this).style("opacity", 0.8);
        dispatch.call("mouseover", this, "class");
      }).on("mouseout", function() {
        d3.select(this).style("opacity", 0.3);
        dispatch.call("mouseout", this, "class");
      }).on("click", function() {
        selected[1] = selected[1] ? false : true;
        d3.select(this).classed("selectedType", selected[1]);
        dispatch.call("select", this, calSelected());
      })

    selection3.append("rect")
      .attr("id", "library")
      .style("width", width)
      .style("height", height)
      .style("fill", "#6CC57F")
      .style("opacity", 0.3)
      .on("mouseover", function() {
        d3.select(this).style("opacity", 0.8);
        dispatch.call("mouseover", this, "library");
      }).on("mouseout", function() {
        d3.select(this).style("opacity", 0.3);
        dispatch.call("mouseout", this, "library");
      }).on("click", function() {
        selected[2] = selected[2] ? false : true;
        d3.select(this).classed("selectedType", selected[2]);
        dispatch.call("select", this, calSelected());
      })

    selection1.append("text").text("test").attr("transform", function(d) {
      var l = d3.select(this).node().getComputedTextLength();
      return "translate(" + (width - l) / 2 + "," + (height + 8) / 2 + ")";
    });
    selection2.append("text").text("classes").attr("transform", function(d) {
      var l = d3.select(this).node().getComputedTextLength();
      return "translate(" + (width - l) / 2 + "," + (height + 8) / 2 + ")";
    });
    selection3.append("text").text("libraries").attr("transform", function(d) {
      var l = d3.select(this).node().getComputedTextLength();
      return "translate(" + (width - l) / 2 + "," + (height + 8) / 2 + ")";
    });

    return lview.update();
  };

  lview.update = function() {
    return lview;
  };

  ///////////////////////////////////////////////////
  // Private Functions

  function calSelected() {
    var result = [];
    for (var i = 0; i < selected.length; i++) {
      if (selected[i]) {
        if (i == 0) {
          result.push("test");
        } else if (i == 1) {
          result.push("class");
        } else {
          result.push("library");
        }
      }
    }
    return result;
  };

  function private_function2() {

  };

  function private_function3() {

  };

  return lview;
};
