// get the data
var nodecolor = d3.scale.category20();

d3.json("data.json", function(error, graph) {

    var nodes = {};

// Compute the distinct nodes from the links.
    var links = graph.links;

    var width = 1500,
            height = 1500;

    var force = d3.layout.force()
            .nodes(graph.nodes)
            .links(links)
            .size([width, height])
            .linkDistance(function(d) {
                return 1/d.value * 100;
            })
            .gravity(0.046)
            .charge(-8)
            .on("tick", tick)
            .start();

// Set the range
    var  v = d3.scale.linear().range([0, 100]);

// Scale the range of the data
    v.domain([0, d3.max(links, function(d) { return d.value/1000; })]);

// asign a type per value to encode opacity
    // links.forEach(function(link) {
    //     if (v(link.value) <= 25) {
    //         link.type = "twofive";
    //     } else if (v(link.value) <= 50 && v(link.value) > 25) {
    //         link.type = "fivezero";
    //     } else if (v(link.value) <= 75 && v(link.value) > 50) {
    //         link.type = "sevenfive";
    //     } else if (v(link.value) <= 100 && v(link.value) > 75) {
    //         link.type = "onezerozero";
    //     }
    // });

    var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

// build the arrow.
    svg.append("svg:defs").selectAll("marker")
            .data(["end"])      // Different link/path types can be defined here
            .enter().append("svg:marker")    // This section adds in the arrows
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

// add the links and the arrows
    var path = svg.append("svg:g").selectAll("path")
            .data(force.links())
            .enter().append("svg:path")
            .attr("class", function(d) { return "link " + d.type; })
            .attr("marker-end", "url(#end)");

// define the nodes
    var node = svg.selectAll(".node")
            .data(force.nodes())
            .enter().append("g")
            .attr("class", "node")
            .on("click", click)
            .on("dblclick", dblclick)
            .call(force.drag);

// add the nodes
    node.append("circle")
             .attr("r",function(d){
                 if(d.group>=1780){
                    return 15
                 }else{
                    return 6
                 }
             })
             //, function(d){
            //     if(d.user_name === "James"){
            //         return 30;
            //     }
            //     else{
            //         return 0;
            //     }
            // })
            .style("fill", function(d) {
                if(d.group>=1780){
                    return 'black';
                }
                else if(d.believed === true){
                    return 'blue';
                }
                else{
                    return 'red';
                }
            });
            // .style("opacity",function(d){
            //     if(d.group<1780){
            //         if(d.believed){
            //         return 1
            //     }
            //     else{
            //         return .5
            //     }
            // }
            // });

//Tooltip
    node.append("title")
            .text(function(d){
                return d.user_name;
            });

// add the text
    // node.append("text")
    //         .attr("x", 12)
    //         .attr("dy", ".35em")
    //         .text(function(d) { return d.name; });

// add the curvy lines
    function tick() {
        path.attr("d", function(d) {
            var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
            return "M" +
                    d.source.x + "," +
                    d.source.y + "A" +
                    dr + "," + dr + " 0 0,1 " +
                    d.target.x + "," +
                    d.target.y;
        });

        node
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")"; });
    }

// action to take on mouse click
    function click() {
        d3.select(this).select("text").transition()
                .duration(750)
                .attr("x", 22)
                .style("fill", "steelblue")
                .style("stroke", "lightsteelblue")
                .style("stroke-width", ".5px");
        d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", function(d){
                    if(d.group>=1780){
                        return 20;
                    }
                    else{
                        return 10;
                    }
                })
                .style("fill", function(d) {
                    if(d.group>=1780){
                        return 'black';
                    }
                    else if(d.believed === true){
                        return 'Blue';
                    }
                    else{
                        return 'Red';
                    }
                });
    }

// action to take on mouse double click
    function dblclick() {
        d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 6)
                .style("fill", function(d) {
                    return nodecolor(d.group);
                });
        d3.select(this).select("text").transition()
                .duration(750)
                .attr("x", 12)
                .style("stroke", "none")
                .style("fill", "black")
                .style("stroke", "none")
                .style("font", "10px sans-serif");
    }

});
