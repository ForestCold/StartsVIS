/*
	Generate class dependencies graph
	Author : Hanfei Lin
	Date: 10/14/2017
*/

vis.overview = function(){

	var overview = {},
		container = null,
		data = null,
		size = [960, 800],
	 	margin = {left:10, top:10, right:10, bottom:10},
		dispatch = d3.dispatch("select", "mouseover", "mouseout");

	overview.container = function(_) {
		if (!arguments.length) return container;
		container = _;
		return overview;
	};

	overview.data = function(_) {
		if (!arguments.length) return data;
		data = _;
		return overview;
	};

	overview.dispatch = dispatch;

	///////////////////////////////////////////////////
	// Private Parameters

	///////////////////////////////////////////////////
	// Public Function
	overview.layout = function() {

    var group = groupCaculator();

		return overview;
	};

	overview.render = function() {
		console.log(data)


		return overview.update();
	};

	overview.update = function() {
		return overview;
	};

	///////////////////////////////////////////////////
	// Private Functions

	function groupCaculator() {
		var group = [];
		for (var i = 0; i < data.nodes.length; i++){
			var index = data.nodes[i].group;
			if (!isNaN(group[index])){
				group[index] += 1;
			} else {
				group[index] = 1;
			}
		}
		console.log(group);
		return group;
	};

	function private_function2() {

	};

	function private_function3() {

	};

	return overview;
};
