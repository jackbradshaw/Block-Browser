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
	directive('spinner',function()
	{
		 return {
		    restrict: 'E',		   
		    templateUrl: 'partials/spinner.html'
		};
	});
	
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

				$scope.displayInfo = false;

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

		var nodeLookup = {};
		var width = 1000,
    		height = 100;


		 return {
		    restrict: 'E',
		    scope: {
		        val: '=',
		        //transactionInfo: ''		       		       
		    },
		    templateUrl: 'partials/TransactionTraceTemplate.html'
		    ,  
			link: function (scope, element, attrs) 
			{			
				console.log('link');

				var color = d3.scale.category20();
				var graph;
				scope.transactionInfo = { hash : 'test', value : 'value' };
				
				//scope.transaction = { hash: 'testhash' , value : 10 };

				var force = d3.layout.force()
				    //.charge(-120)
				    //.linkDistance(function(d) { return d.weight * 10 })
				    .size([width, height]);


				var svg = d3.select(element.find('.transaction-container')[0]).append("svg");

				svg.attr("id", "playgraph")
					.attr("height", '100%')
					.attr("width", '100%')
	             	//better to keep the viewBox dimensions with variables
	            	.attr("viewBox", "0 0 " + width + " " + height )
	            	.attr("preserveAspectRatio", "xMidYMid meet")
	            	;
				   

  				svg.append("svg:defs").selectAll("marker")
				    .data(["end"])      // Different link/path types can be defined here
				  .enter().append("svg:marker")    // This section adds in the arrows	
				    .attr("id", String)
				    .attr("viewBox", "0 -5 10 10")
				    .attr("refX", 5)
				    .attr("markerWidth", 6)
				    .attr("markerHeight", 6)
				    .attr("orient", "auto")
				  .append("svg:path")
				    .attr("d", "M0,-5L10,0L0,5")
				    .attr("fill","context-stroke")
				    .attr("stroke", "context-stroke");		

				svg.call(d3.behavior.zoom().on("zoom", zoom)).on("dblclick.zoom", null);					

   				var vis = svg.append("g");   				

				function zoom() {
  					vis.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
				}

				scope.$watch('val', function (newVal, oldVal) {  
					
					if(newVal != null)
					{
						var orignalNode = newVal;
						orignalNode.start = true;
						orignalNode.fixed = true;
						
						graph = 
							{
								nodes : [orignalNode],
								links : []
							};
							console.dir(graph);

							addOutputNode(orignalNode);
						update();
					}
					function update()
					{
						force
							.alpha(1)
						    .nodes(graph.nodes)
						    .links(graph.links)
						    .linkDistance(80)
						    .linkStrength(0.5)
						    .charge(nodeCharge)
						    .start();
					
				        
						var link = vis.selectAll(".link")
						    .data(graph.links, linkKeyFunction)						

						link.enter().insert("path", ".node")
						    .attr("class", "link")						     
						    .style("stroke-width", function(d) { return d.value; })
						    .attr("marker-mid", "url(#end)");

						link.exit().remove();

					    var node = vis.selectAll(".node")					    
						    .data(graph.nodes, nodeKeyFunction)		
						   
						//Enter
						node.enter().append("circle")							
						    //.attr("class", "node")
						    .attr("r", nodeRadius);						    

						node.attr("class", function(d) { return "node " + ((d.clicked || d.danglingOut || d.source) ? "" : "clickable"); })						 
							 .call(force.drag)							
							.style("fill", nodeColour )
							.style("stroke", nodeStroke)
						// .on('mouseover', nodeMouseOver)
						   // .on('mouseout', nodeMouseOut)
						    .on('click', click)
						    .on('dblclick', doubleClick)
						    ;
						   
						   		   

						node.exit().remove();

						force.on("tick", function() {
						    link.attr("x1", function(d) { return d.source.x; })
						        .attr("y1", function(d) { return d.source.y; })
						        .attr("x2", function(d) { return d.target.x; })
						        .attr("y2", function(d) { return d.target.y; });

							node.attr("cx", function(d) { return d.x; })
						    	.attr("cy", function(d) { return d.y; });


					    	link.attr("d", function(d) {

					    		var dist = Math.sqrt(Math.pow(d.target.x - d.source.x, 2) +  Math.pow(d.target.y - d.source.y, 2));
					    		var r1 = nodeRadius(d.source), r2 = nodeRadius(d.target);
					    		//console.log('r1', r1,'r2',r2);
					    		var factor = (dist + r1 - r2)/ (2 * dist);

					    		//Calulate the point on the path half way along the visible section:
						        var mx = d.source.x + (d.target.x - d.source.x ) * factor,
						            my = d.source.y + (d.target.y - d.source.y) * factor;
						          
						        return "M" + 
						            d.source.x + "," + 
						            d.source.y + "L" + 
						            mx + "," + my  + "L" +
						            d.target.x + "," + 
						            d.target.y;
						    });
						}); 
					}	

					function linkKeyFunction(d)
					{
						return d.source.hash.toString() + d.target.hash.toString();
					}

					function nodeKeyFunction(d)
					{
						return d.hash;
					}

					function nodeCharge(d)
					{
						return level(d.value).charge;
					}

					function nodeStroke(d)
					{
						if(d.found) return "black";
						if(d.danglingOut) return level(d.value).colour;
						return null;
					}

					function nodeRadius(d)
					{						
						var radius = level(d.value).radius; return radius;
					}

					function nodeColour(d)
					{						
						if(d.danglingOut) return "white";
						//if(d.start) return "yellow";
						if(d.in[0].prev_out.hash == 0) return "black";						
						return level(d.value).colour;
					}	

					function level(value)
					{
						var levels = 
						[
							new Level(0, 0.1, '#e0f3db'),
							new Level(0.1, 0.5, '#ccebc5'),
							new Level(0.5, 1, '#a8ddb5'),
							new Level(1.0, 5, '#7bccc4'),
							new Level(5.0, 10, '#4eb3d3'),
							new Level(10.0, 50, '#2b8cbe'),
							new Level(50.0, 100, '#08589e'),
							new Level(100.0, 500, '#084081') 
						];

						for(var i in levels)
						{
							if(value < levels[i].threshold) 
							{
								//console.log(levels[i]);
								return levels[i];
							}
						}
						return levels.splice(-1)[0];

						function radius(value, start, end)
						{
							console.log(value, start, end);
							var rad = ((value - start)/(end - start))*40 + 10;
							console.log('rad: ' + rad);
							return rad;
						}		


						function Level(start, stop, colour)
						{
							var val = value;
							if(value < start) val = start;
							if(value > stop) val = stop;

							var relativeSize = (val - start)/(stop - start);
							
							this.threshold = stop;

							this.colour = colour;

							this.radius = relativeSize * 40 + 10;							

							this.charge = -800//(relativeSize * 200 + 200);							
						}				
					}

					function ReviseDanglingOut(node, index)
					{
						var hashToFind = danglingOutKey(node);

						//Find dangling out node in node array
						var nodeIndex;
						for(var i in graph.nodes)
						{
							if(graph.nodes[i].hash == hashToFind)
							{
								nodeIndex = i;
								break;
							}
						}
						
						console.log('node index: ' + nodeIndex);
						if(nodeIndex != null)
						{
							//Decresse the value of the the dangling output by the value being inculded in the new transaction:
							var danglingOutNode = graph.nodes[nodeIndex];
							console.log(danglingOutNode);
							console.log('orignal value', danglingOutNode.value)

							console.log('found value' , node.out[index].value);
							danglingOutNode.value -= node.out[index].value;

							console.log('remaining value', danglingOutNode.value)

							//If the value is dreased to zero, removed the dangling out all together:
							if(danglingOutNode.value <= 0)
							{
								graph.nodes.splice(nodeIndex, 1);							

								//Find connecting in edge in edge array
								var linkIndex;
								for(var i in graph.links)
								{
									if(graph.links[i].source.hash == node.hash)
									{
										linkIndex = i;
										break;
									}
								}
								if(linkIndex != null)
								{
									graph.links.splice(linkIndex, 1); 
								}	
							}
						}				
					}		

					function danglingOutKey(node)
					{
						return node.hash + 'o';
					}	

					function click(d)
					{
						scope.displayInfo = true;
						scope.transactionInfo = { value : d.value };	
						if(d.danglingOut)
						{							
							scope.transactionInfo.numberOfOutputs = d.numberOfOutputs;
						}
						else
						{
							scope.transactionInfo.hash = d.hash;
						}

						scope.$digest();	
					}

					function addOutputNode(node, exculdedIndex)
					{
						var otherOutputTotal = 0;
						//Add dangling outs:
						node.out.forEach(function (out, index)
						{
							if(exculdedIndex == null || index != exculdedIndex)
							{
								otherOutputTotal += parseFloat(out.value);												
							}
						});
						if(otherOutputTotal > 0)
						{
							console.log('otherOutputTotal',otherOutputTotal);						

							var outNode = { hash: danglingOutKey(node), danglingOut : true, value : otherOutputTotal };

							//Stores how many unbound transcations there are
							outNode.numberOfOutputs = node.out.length;
							if(exculdedIndex) --outNode.numberOfOutputs;

							graph.nodes.push(outNode);
							graph.links.push({ "source": node, "target": outNode, "weight" : otherOutputTotal });
						}
					}

					function doubleClick(d)
					{		
						console.log('click', scope.transaction);

						console.dir(d);
						
						var clickedNode = graph.nodes[d.index];

						if(!clickedNode.clicked)
						{
							clickedNode.clicked = true;							

							var transactionPromises = Transactions.getPreviousTransactions(d);

							transactionPromises.then(function(results) {
								results.forEach( function(result)
								{
									var transaction = result.transaction;
									var outIndex = result.index;

									//Check transcation not already in graph by using dictionary
									//if it is, will need to remove dangling out and add link	
									var existingNode = nodeLookup[transaction.hash];
									
									if(existingNode != null)
									{
										console.log('existing', existingNode);
										existingNode.found = true;
										ReviseDanglingOut(existingNode, outIndex);

										//Add in new link:
										graph.links.push({ "source": existingNode, "target": clickedNode, "weight" : existingNode.out[result.index].value });

									}
									else
									{	
										//The transaction is new:	
										var rnd =Math.random();
										var newNode = transaction;

										addOutputNode(newNode, outIndex);
									
										//Set the intial position of the node to be the position of its parent:
										newNode.x = clickedNode.x + rnd*50;
										newNode.y = clickedNode.y + rnd*50;

										if(newNode.in[0].prev_out.hash == 0) newNode.source = true;
										//console.log('newnode x : ',newNode.x);

										graph.nodes.push(newNode);
										nodeLookup[newNode.hash] = newNode;
										graph.links.push({ "source": newNode, "target": clickedNode, "weight" : newNode.out[result.index].value });

									}
									//update();
								});
								update();

								console.log('click end', scope.transaction);
							})
						}
					}						
				});
			}
		}	
	}]);