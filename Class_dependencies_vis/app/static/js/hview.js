/*
	Generate class dependencies graph
	Author : Hanfei Lin
	Date: 10/14/2017
*/

vis.hview = function(){

	var hview = {},
		container = null,
		data = null,
		size = [960, 800],
	 	margin = {left:10, top:10, right:10, bottom:10},
		dispatch = d3.dispatch("select", "mouseover", "mouseout");

	hview.container = function(_) {
		if (!arguments.length) return container;
		container = _;
		return hview;
	};

	hview.data = function(_) {
		if (!arguments.length) return data;
		data = _;
		return hview;
	};

	hview.dispatch = dispatch;

	///////////////////////////////////////////////////
	// Private Parameters

	///////////////////////////////////////////////////
	// Public Function
	hview.layout = function() {

		return hview;
	};

	hview.render = function() {

		function tabulate(data, columns) {

			var table = container.append('table').attr("class","sourceTable");
			var thead = table.append('thead');
			var	tbody = table.append('tbody');

			// append the header row
			thead.append('tr')
			  .selectAll('th')
			  .data(columns).enter()
			  .append('th')
			    .text(function (column) { return column; });

			// create a row for each object in the data
			var rows = tbody.selectAll('tr')
			  .data(data)
			  .enter()
			  .append('tr');

			// create a cell in each row for each column
			var cells = rows.selectAll('td')
			  .data(function (row) {
			    return columns.map(function (column) {
			      return {column: column, value: row[column]};
			    });
			  })
			  .enter()
			  .append('td')
			    .text(function(d){
						return d.value;
					});

		  return table;
		}

		// render the table(s)
		tabulate(data, ['source', 'target']); // 2 column table


		return hview.update();
	};

	hview.update = function() {
		return hview;
	};

	///////////////////////////////////////////////////
	// Private Functions

	function private_function1() {

	};

	function private_function2() {

	};

	function private_function3() {

	};

	return hview;
};
