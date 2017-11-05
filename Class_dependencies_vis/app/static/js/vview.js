/*
	Show class information
	Author : Hanfei Lin
	Date: 10/14/2017
*/

vis.vview = function() {

  var vview = {},
    container = null,
    data = null,
    nodeInfo = null,
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

  vview.container = function(_) {
    if (!arguments.length)
      return container;
    container = _;
    return vview;
  };

  vview.data = function(_) {
    if (!arguments.length)
      return data;
    data = _;
    return vview;
  };

  vview.nodeInfo = function(_) {
    if (!arguments.length)
      return nodeInfo;
    nodeInfo = _;
    return vview;
  };

  vview.dispatch = dispatch;

  ///////////////////////////////////////////////////
  // Private Parameters
  var visited = [],
    treeRoot = null;

  ///////////////////////////////////////////////////
  // Public Function
  vview.layout = function() {

    treeRoot = {
      "name": nodeInfo.value,
      "children": []
    };

    visited = [];
    buildTree(treeRoot, nodeInfo);

    return vview;
  };

  vview.render = function() {

    size[0] = parseInt(container.style("width")) - margin.left - margin.right;
    size[1] = parseInt(container.style("height")) - margin.top - margin.bottom;

    var svg = container.append("svg").attr("width", size[0] + margin.right + margin.left).attr("height", size[1] + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var i = 0,
      duration = 750,
      root;

    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([size[0], size[1]]);

    // Assigns parent, children, height, depth
    root = d3.hierarchy(treeRoot, function(d) {
      return d.children;
    });
    root.x0 = 0;
    root.y0 = size[0] / 2;

    // Collapse after the second level
    root.children.forEach(collapse);

    update(root);

    // Collapse the node and all it's children
    function collapse(d) {
      if (d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
      }
    }

    function update(source) {

      // Assigns the x and y position for the nodes
      var treeData = treemap(root);

      // Compute the new tree layout.
      var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

      // ****************** Nodes section ***************************
      // Update the nodes...
      var node = svg.selectAll('g.node').data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });

      // Enter any new modes at the parent's previous position.
      var nodeEnter = node.enter().append('g').attr('class', 'node').attr("transform", function(d) {
        return "translate(" + source.x0 + "," + source.y0 + ")";
      }).on('click', click);

      // Add Circle for the nodes
      nodeEnter.append('circle').attr('class', 'node').attr('r', 1e-6).style("fill", function(d) {
        return d._children
          ? "lightsteelblue"
          : "#fff";
      });

      // UPDATE
      var nodeUpdate = nodeEnter.merge(node);

      // Transition to the proper position for the node
      nodeUpdate.transition().duration(duration).attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

      // Update the node attributes and style
      nodeUpdate.select('circle.node').attr('r', 10).style("fill", function(d) {
        return d._children
          ? "lightsteelblue"
          : "#fff";
      }).attr('cursor', 'pointer');

      // Remove any exiting nodes
      var nodeExit = node.exit().transition().duration(duration).attr("transform", function(d) {
        return "translate(" + source.x + "," + source.y + ")";
      }).remove();

      // On exit reduce the node circles size to 0
      nodeExit.select('circle').attr('r', 1e-6);

      // On exit reduce the opacity of text labels
      nodeExit.select('text').style('fill-opacity', 1e-6);

      // ****************** links section ***************************

      // Update the links...
      var link = svg.selectAll('path.link').data(links, function(d) {
        return d.id;
      });

      // Enter any new links at the parent's previous position.
      var linkEnter = link.enter().insert('path', "g").attr("class", "link").attr('d', function(d) {
        var o = {
          x: source.x0,
          y: source.y0
        }
        return diagonal(o, o)
      });

      // UPDATE
      var linkUpdate = linkEnter.merge(link);

      // Transition back to the parent element position
      linkUpdate.transition().duration(duration).attr('d', function(d) {
        return diagonal(d, d.parent)
      });

      // Remove any exiting links
      var linkExit = link.exit().transition().duration(duration).attr('d', function(d) {
        var o = {
          x: source.x,
          y: source.y
        }
        return diagonal(o, o)
      }).remove();

      // Store the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      // Creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s, d) {

				path = `M ${s.x} ${s.y}
				C ${(s.x + d.x) / 2} ${s.y},
					${(s.x + d.x) / 2} ${d.y},
					${d.x} ${d.y}`

        return path
      }

      // Toggle children on click.
      function click(d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      }
    }

    return vview.update();
  };

  vview.update = function() {
    return vview;
  };

  ///////////////////////////////////////////////////
  // Private Functions

  function buildTree(root, rootNode) {
    if (rootNode.children.length == 0) {
      return;
    }

    for (var i = 0; i < rootNode.children.length; i++) {
      if (rootNode.children[i] in visited) {
        continue;
      }
      visited.push(rootNode.children[i]);
      var next = data.nodes[rootNode.children[i]].value;
      var h = {
        "name": next,
        "children": []
      }
      root["children"].push(h);
      buildTree(root["children"][root.children.length - 1], data.nodes[rootNode.children[i]]);
    }
  }

  function private_function2() {};

  function private_function3() {};

  return vview;
};
