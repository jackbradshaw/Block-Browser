'use strict';

/* Directives */


var directives = angular.module('blockBrowser.directives', []);

directives.
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);


directives.
	directive('ghVisualization', function () {

		  // constants
		var margin = 20,
		  width = 960,
		  height = 500 - .5 - margin,
		  color = d3.interpolateRgb("#f77", "#77f");

		return {
		    restrict: 'E',
		    scope: {
		        val: '=',
		        grouped: '='
		    },  
			link: function (scope, element, attrs) {

				var m = [20, 120, 20, 120],
				    w = 1280 - m[1] - m[3],
				    h = 100 - m[0] - m[2],
				    offset = 40,
				    i = 0,
				    circleRadius = 4.5,
				    root;

		       var vis = d3.select(element[0]).append("svg:svg");

		       vis.attr("width", w + m[1] + m[3])
				    .attr("height", h + m[0] + m[2])
				    .append("svg:g")
				    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

			    scope.$watch('val', function (newVal, oldVal) {

			        // clear the elements inside of the directive
			        //vis.selectAll('*').remove();
			        console.log(newVal);
			        // if 'val' is undefined, exit
			        if (!newVal || newVal.length == 0) {
			            return;
			        }

			        //vis.attr("height", )
			        var height = 3 * circleRadius * (newVal.n_tx + 1);
			        vis.attr("height", height + m[0] + m[2]);
					var tree = d3.layout.tree();

					    tree.size([height, w]);
					   // .nodeSize([70,40]);

					var diagonal = d3.svg.diagonal()
					    .projection(function(d) { return [d.y, d.x]; });
					

					//d3.json("flare.json", function(json) {
						 root = newVal.tree[0];
						 root.x0 = h / 2;
						 root.y0 = 0;

						 function toggleAll(d) {
						    if (d.children) {
						      d.children.forEach(toggleAll);
						      toggle(d);
						    }
						}

						 // Initialize the display to show a few nodes.
						 // root.children.forEach(toggleAll);
						 // toggle(root.children[1]);
						 // toggle(root.children[1].children[2]);
						 // toggle(root.children[9]);
						 // toggle(root.children[9].children[0]);

						 update(root);
					//});
					
					function circleColour(d)
					{ 
			        	if(d.duplicated)
			        		return "black";
			        	else
			        		return d._children ? "lightsteelblue" : "#fff"; 
					}

					function update(source) {
					    var duration = d3.event && d3.event.altKey ? 5000 : 500;

						// Compute the new tree layout.
						var nodes = tree.nodes(root).reverse();

					    // Normalize for fixed-depth.
					    nodes.forEach(function(d) { d.y = d.depth * offset; });

					    // Update the nodes…
					    var node = vis.selectAll("g.node")
					        .data(nodes, function(d) { return d.id || (d.id = ++i); });

					    // Enter any new nodes at the parent's previous position.
					    var nodeEnter = node.enter().append("svg:g")
					        .attr("class", "node")
					        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
					        .on("click", function(d) { toggle(d); update(d); });

					    nodeEnter.append("svg:circle")
					        .attr("r", 1e-6)
					        .style("fill", circleColour);

					    nodeEnter.append("svg:text")
					        .attr("x", function(d) { return 10; })
					        .attr("dy", ".35em")
					        .attr("text-anchor", function(d) { return "start"; })
					        .text(function(d) { return d.children && d.children.length == 0 && !d.duplicated ? d.hash : "" })
					        .style("fill-opacity", 1e-6);

					    // Transition nodes to their new position.
					    var nodeUpdate = node.transition()
					      .duration(duration)
					      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

					    nodeUpdate.select("circle")
					        .attr("r", circleRadius)
					        .style("fill", circleColour);

					    nodeUpdate.select("text")
					        .style("fill-opacity", 1)
					        .text(function(d) { return d.children && d.children.length == 0 && !d.duplicated ? d.hash : "" });

					    // Transition exiting nodes to the parent's new position.
					    var nodeExit = node.exit().transition()
					        .duration(duration)
					        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
					        .remove();

						 nodeExit.select("circle")
						     .attr("r", 1e-6);

						 nodeExit.select("text")
						     .style("fill-opacity", 1e-6);

					    // Update the links…
					    var link = vis.selectAll("path.link")
					        .data(tree.links(nodes), function(d) { return d.target.id; });

					    // Enter any new links at the parent's previous position.
					    link.enter().insert("svg:path", "g")
					        .attr("class", "link")
					        .attr("d", function(d) {
					            var o = {x: source.x0, y: source.y0};
					            return diagonal({source: o, target: o});
					        })
					      .transition()
					          .duration(duration)
					          .attr("d", diagonal);

					    // Transition links to their new position.
					    link.transition()
					        .duration(duration)
					        .attr("d", diagonal);

					    // Transition exiting nodes to the parent's new position.
					    link.exit().transition()
					        .duration(duration)
					        .attr("d", function(d) {
					          var o = {x: source.x, y: source.y};
					          return diagonal({source: o, target: o});
					        })
					        .remove();

					    // Stash the old positions for transition.
					    nodes.forEach(function(d) {
					      d.x0 = d.x;
					      d.y0 = d.y;
					    });
					 }

					// Toggle children.
					function toggle(d) {
					    if (d.children) {
					  		d._children = d.children;
					 	    d.children = null;
					    } else {
					   	 	d.children = d._children;
					   	 	d.children.push({hash: "123", children : []});
					   	 	d._children = null;
					    }
					}
				});
			}
		}	
	});

directives.
	directive('transactionHistory', ['Transactions', function (Transactions) {

		var width = 960,
    		height = 500;

		 return {
		    restrict: 'E',
		    scope: {
		        val: '=',		       
		    },  
			link: function (scope, element, attrs) {			

				var color = d3.scale.category20();
				var graph;

				var force = d3.layout.force()
				    //.charge(-120)
				    //.linkDistance(function(d) { return d.weight * 10 })
				    .size([width, height]);

				var svg = d3.select("body").append("svg")
				    .attr("width", width)
				    .attr("height", height);

				scope.$watch('val', function (newVal, oldVal) {  

					// d3.json("./transactionExample.json", function(data) {
					// 	graph = data;
					// 	update();		     				
					// });
					//console.dir(newVal);
					if(newVal != null)
					{
						//console.dir(newVal);
						graph = 
							{
								nodes : [newVal],
								links : []
							};
							console.dir(graph);
						update();
					}
					function update()
					{
						force
						    .nodes(graph.nodes)
						    .links(graph.links)
						    .charge(-30)
						    .start();

						var link = svg.selectAll(".link")
						    .data(graph.links);//, function(d) { return d.id; });

						link.enter().insert("line", ".node")
						    .attr("class", "link")
						    .style("stroke-width", function(d) { return Math.sqrt(d.value); });

						// link.append("line")
						//     .attr("class", "link")
						//     .style("stroke-width", function(d) { return Math.sqrt(d.value); });   

					    var node = svg.selectAll(".node")					    
						    .data(graph.nodes);//, function(d) { return d.hash; });

						//Enter
						node.enter().append("circle")
						    .attr("class", "node")
						    .attr("r", 10)
						    .style("fill", function(d) { return color(d.group); });					   
						   
						//Update
						node.call(force.drag)
						    .on('click', click);					   


						force.on("tick", function() {
						    link.attr("x1", function(d) { return d.source.x; })
						        .attr("y1", function(d) { return d.source.y; })
						        .attr("x2", function(d) { return d.target.x; })
						        .attr("y2", function(d) { return d.target.y; });

							node.attr("cx", function(d) { return d.x; })
						    	.attr("cy", function(d) { return d.y; });
						}); 
					}	

					
					function click(d)
					{
						// //console.dir(d);
						// //var clickedNode = graph.nodes[d.index];
						// var clickedNode = graph.nodes[d.index];
						// console.dir(clickedNode);
						// var newNode = {"hash" : "D", "value" : 19, "prev_out" : []};

						// graph.nodes.push(newNode);
						// graph.links.push({ "id" : "L3", "source": clickedNode, "target": newNode, "weight" : 13 });

						// console.dir(graph.links);
						// update();
						console.dir(d);
						
						var clickedNode = graph.nodes[d.index];

						if(!clickedNode.clicked)
						{
							clickedNode.clicked = true;							

							var transactionPromises = Transactions.getPreviousTransactions(d);

							transactionPromises.then(function(result) {
								result.forEach( function(result)
								{
									var newNode = result.transaction;
									graph.nodes.push(newNode);
									graph.links.push({ "source": clickedNode, "target": newNode, "weight" : newNode.out[result.index].value });
								});
								update();
							})
						}
					}	
					
				});
			}
		}	
	}]);