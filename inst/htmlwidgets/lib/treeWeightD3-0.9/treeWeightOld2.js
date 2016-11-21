/**

Copyright (c) 2014 BrightPoint Consulting, Inc.

 Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
                        restriction, including without limitation the rights to use,
                        copy, modify, merge, publish, distribute, sublicense, and/or sell
                                                                                  copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
                                                                                         EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
                                                                                         WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

function main(datas,conditions,levels,nodeFind,width,height) {

    var m = [20, 120, 20, 120],
        w = 1280 - m[1] - m[3],
        h = 1200 - m[0] - m[2],
        i = 0,
        root = {};
    var sumFields = conditions;
     
    
    var spendField = "sum_"+sumFields[0];
    //var sumFields = ["Cond1", "Cond2", "Cond3"];
   
    
    //var sourceFields = ["Category", "Level1", "Level2", "Level3", "Level4"];
    var sourceFields = levels;
    var colors;
    //if (randomColor != true){
    var    colors = ["#bd0026", "#fecc5c", "#fd8d3c", "#f03b20", "#B02D5D",
        "#9B2C67", "#982B9A", "#692DA7", "#5725AA", "#4823AF",
        "#d7b5d8", "#dd1c77", "#5A0C7A", "#5A0C7A"];
    /*else{
        colors = [getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(), getRandomColor(),
        getRandomColor(), getRandomColor(), getRandomColor(),getRandomColor(), getRandomColor(),
         getRandomColor(), getRandomColor(), getRandomColor()];
    }*/

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    var formatNumber = d3.format(",.2f");
    var formatCurrency = function (d) {
        return formatNumber(d)
    };

    var tree = d3.layout.tree(); // <- d3.layout.tree
    var circles={};
    var paths={};
    var labels={};

    //tree.children(function (d) { return d.values; }).size([h, w]);
    tree.children(function (d) { return d.values; }).size([height, width]);
    
    var toolTip = d3.select(document.getElementById("toolTip"));
    var header  = d3.select(document.getElementById("head"));
    var header1 = d3.select(document.getElementById("header1"));
    var header2 = d3.select(document.getElementById("header2"));
    var header3 = d3.select(document.getElementById("header3"));

    
    var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.y, d.x];
        });

    var svg = d3.select("#body").append("svg:svg")

        //.attr("width", w + m[1] + m[3])
        //.attr("height", h + m[0] + m[2])
        .attr("width",width)
        .attr("height",height)
        .append("svg:g")
        //.attr("transform", "translate(" + m[3] + "," + m[0] + ")");
        .attr("transform", "translate(" + 100 + "," + 100 + ")");
    d3.select("#body").call(d3.behavior.zoom().on("zoom", redraw));
    function redraw() {
        svg.attr("transform",
            "translate(" + d3.event.translate + ")"
            + " scale(" + d3.event.scale + ")");
    }


    //var levelCeil=[{},{},{},{}];
    
    var levelCeil = [];
    for(var i = 1; i < sourceFields.length; i++) {
        levelCeil.push({});
    }

    var nodeRadius;


    var data = datas; 

    /*datas.forEach(function (d) {
        //console.log(d);
        var t = 0;
        for (var i = 0; i < sumFields.length; i++) {
            t += Number(d[sumFields[i]]);
        }
        if (t > 0) {
            data.push(d);
        }
    });*/

    //Remove all zero values nodes
    /*csv.forEach(function (d) {
      
       console.log(d);
        var t = 0;
        for (var i = 0; i < sumFields.length; i++) {
            t += Number(d[sumFields[i]]);
        }
        if (t > 0) {
            data.push(d);
        }
    })*/
    // Transform the data in a tree
    function createNestingFunction(propertyName){
        return function(d){ 
              return d[propertyName];
        };
    }

    var nesting =[];
    for(var i = 1; i < levels.length-1; i++) {
        nesting.push(levels[i]);
    }
    var nest = d3.nest();
    for (var i = 0; i < nesting.length; i++) {
        nest = nest.key( createNestingFunction(nesting[i]) );
    }   
    nest = nest.entries(data);

    root = {};
    root.values = nest;
    root.x0 = height / 2;
    root.y0 = 0;

    var nodes = tree.nodes(root).reverse();

    tree.children(function (d) {
        return d.children;
    });

    initialize();   
    root.values.forEach(toggleAll);

    // Initialize the display to show a node
    if (nodeFind !=null){
        console.log("nodeFind "+nodeFind);
        //[root].forEach(collapse);
        find (root, nodeFind);
    }
    // Initialize the display to show a few nodes.
    else{
        toggleNodes(root.values[1]);
        toggleNodes(root.values[1].values[0].values[0]);
    }
   // toggleNodes(root.values[1].values[0].values[0].values[0]);
    //expandAll();
    
    update(root);

    toggleButtons(0);

    // test export svg to png
    /*d3.select("body")
    .append("button")
    .html("Export")
    .on("click",svgToCanvas);*/

    var w = 1000, // or whatever your svg width is
        h = 1000;


    

    

    function initialize() {


        for (var i = 0; i < sumFields.length; i++) {
            var conditionButton = document.getElementById(sumFields[i]+"Button");
            var cond = sumFields[i];
            
            conditionButton.addEventListener("click", myFunction);

            function myFunction(e){
               
                var index = e.target.index;
                toggleButtons(index);

                spendField = "sum_"+sumFields[index];
                update(root); 
            
            }
            

        }
        
        for (var i = 0; i < sumFields.length; i++) {
            for (var y = 0; y < levelCeil.length; y++) {
                levelCeil[y]["sum_" + sumFields[i]] = 0;
            }
        }
        sumNodes(root.children);
    }

    function toggleAll(d) {
        if (d.values && d.values.actuals) {
            d.values.actuals.forEach(toggleAll);
            toggleNodes(d);
        }
        else if (d.values) {
            d.values.forEach(toggleAll);
            toggleNodes(d);
        }
    }

    function setSourceFields(child, parent) {
        if (parent) {
            for (var i = 0; i < sourceFields.length; i++) {
                var sourceField = sourceFields[i];
                if (child[sourceField] != undefined) {
                    child["source_" + sourceField] = child[sourceField];
                }
                parent["source_" + sourceField] = (child["source_" + sourceField]) ? child["source_" + sourceField] : child[sourceField];
            }
        }

    }

    function sumNodes(nodes) {
        for (var y = 0; y < nodes.length; y++) {
            var node = nodes[y];
            if (node.children) {
                sumNodes(node.children);
                for (var z = 0; z < node.children.length; z++) {
                    var child = node.children[z];
                    for (var i = 0; i < sumFields.length; i++) {
                        if (isNaN(node["sum_" + sumFields[i]])) node["sum_" + sumFields[i]] = 0;
                        node["sum_" + sumFields[i]] += Number(child["sum_" + sumFields[i]]);
                        if ((node.parent)) {
                            levelCeil[node.depth-1]["sum_" + sumFields[i]] = Math.max(levelCeil[node.depth-1]["sum_" + sumFields[i]], Number(node["sum_" + sumFields[i]]));
                            setSourceFields(node, node.parent);
                        }

                    }
                }
            }
            else {
                for (var i = 0; i < sumFields.length; i++) {
                    node["sum_" + sumFields[i]] = Number(node[sumFields[i]]);
                    if (isNaN(node["sum_" + sumFields[i]])) {
                        node["sum_" + sumFields[i]] = 0;
                    }
                }
            }
            setSourceFields(node, node.parent);
        }

    }

    function update(source) {


       
        //tree = tree.size([width, w]);
        var duration = d3.event && d3.event.altKey ? 5000 : 500;

        var nodes = tree.nodes(root).reverse();

        var depthCounter = 0;

        nodeRadius = d3.scale.sqrt()
            .domain([0, levelCeil[0][spendField]])
            .range([1, 40]);

        // Normalize for fixed-depth.
        nodes.forEach(function (d) {
            d.y = d.depth * 180;
            d.numChildren = (d.children) ? d.children.length : 0;
            if (d.depth == 1) {
                d.linkColor = colors[(depthCounter % (colors.length - 1))];
                depthCounter++;
            }
            if (d.numChildren == 0 && d._children) d.numChildren = d._children.length;

        });

        //Set link colors based on parent color
        nodes.forEach(function (d) {
            var obj = d;
            while ((obj.source && obj.source.depth > 1) || obj.depth > 1) {
                obj = (obj.source) ? obj.source.parent : obj.parent;
            }
            d.linkColor = (obj.source) ? obj.source.linkColor : obj.linkColor;

        });

        // Update the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("svg:g")
            .attr("class", "node")
            .attr("id",function (d) { return "node_" + d.key })
            .attr("transform", function (d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on("click", function (d) {
                
                if (d.numChildren > 500) {
                    alert(d.key + " has too many nodes (" + d.numChildren + ") to view at once.");
                }
                else {
                    toggleNodes(d);
                    update(d);
                }
            });

        nodeEnter.append("svg:circle")
            .attr("r", 1e-6)
            .on("mouseover", function (d) {
                node_onMouseOver(d);
            })
            .on("mouseout", function (d) { node_onMouseOut(d)})
            .style("fill", function (d) {
                circles[d.key] = this;
                return d.source ? d.source.linkColor : d.linkColor;
            })
            .style("fill-opacity", ".8")
            .style("stroke", function (d) {
                return d.source ? d.source.linkColor : d.linkColor;

            });

        nodeEnter.append("svg:text")
            .attr("x", function (d) {
                labels[d.key] = this;
                return d.children || d._children ? -15 : 15;
            })
            .attr("dy", ".35em")
            .attr("text-anchor",
            function (d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function (d) {
                /*var ret = (d.depth == 4) ? d.Level4 : d.key;
                ret = (String(ret).length > 25) ? String(ret).substr(0, 22) + "..." : ret;
                return ret;*/

                
                var categ =d.Category+"";
                var cat = categ.split(" ");
        
                var ret = (d.depth == sourceFields.length-1) ? categ : d.key;
                ret = (String(ret).length > 25) ? String(ret).substr(0, 22) + "..." : ret;
                return ret;

            })
            .style("fill-opacity", "0")
            .style("font-size","12")
            .on("mouseover", function (d) {node_onMouseOver(d);})
            .on("mouseout", function (d) { node_onMouseOut(d)});

        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        nodeUpdate.select("circle")
            .attr("r", function (d) { return isNaN(nodeRadius(d[spendField])) ? 2: nodeRadius(d[spendField]); })
            .style("fill", function (d) { return d.source ? d.source.linkColor : d.linkColor })
            .style("fill-opacity", function (d) { return ((d.depth + 1) / 5);});

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("circle").attr("r", 1e-6);

        nodeExit.select("text").style("fill-opacity", 1e-6);

        var link = svg.selectAll("path.link")
            .data(tree.links(nodes), function (d) {
                return d.target.id;
            });

        var rootCounter = 0;

        // Enter any new links at the parent's previous position.
        link.enter().insert("svg:path", "g")
            .attr("class", "link")
            .attr("id",function (d) { return "link_" + d.target.key })
            .attr("d", function (d) {
                paths[d.target.key] = this;
                if (Number(d.target[spendField]) > 0) {
                    var o = {x: source.x0, y: source.y0};
                    return diagonal({source: o, target: o});
                }
                else {
                    null;
                }
            })
            .style("stroke", function (d, i) {
                if (d.source.depth == 0) {
                    rootCounter++;
                    return (d.source.children[rootCounter - 1].linkColor);
                }
                else {
                    return (d.source) ? d.source.linkColor : d.linkColor;
                }
            })
            .style("stroke-width", function (d, i) { return isNaN(nodeRadius(d.target[spendField])) ? 4: nodeRadius(d.target[spendField])*2; })
            .style("stroke-opacity", function (d) { return d.target[spendField] <= 0 ? .1 : ((d.source.depth + 1) / 4.5); })
            .style("stroke-linecap", "round")
            .on("mouseover", function (d) {node_onMouseOver(d.source);})
            .on("mouseout", function (d) { node_onMouseOut(d.source)});

        link.transition()
            .duration(duration)
            .attr("d", diagonal)
            .style("stroke-width", function (d, i) { return isNaN(nodeRadius(d.target[spendField])) ? 4: nodeRadius(d.target[spendField])*2; })
            .style("stroke-opacity", function (d) {
                var ret = ((d.source.depth + 1) / 4.5)
                if (d.target[spendField] <= 0) ret = .1;
                return ret;
            })

        link.exit().transition()
            .duration(duration)
            .attr("d", diagonal)
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });


        function node_onMouseOver(d) {

            if (typeof d.target != "undefined") {
                d = d.target;
            }
            console.log("d "+d["Category"]);
            console.log("d "+d["source_Level1"]);
            console.log("d "+d["source_Level2"]);
            console.log("d "+d["source_Level3"]);

            console.log("d "+d["sum_"+sumFields[0]]);
            console.log("d "+d["sum_"+sumFields[1]]);
            console.log("d "+d["sum_"+sumFields[2]]);
            console.log("d depth "+d.depth);
            console.log(d);
              

            toolTip.transition()
                .duration(200)
                .style("opacity", ".9");
            header.text(d["source_Level1"]);
            header1.text((d.depth > 1) ? d["source_Level2"] : "");
            header2.html((d.depth > 2) ? d["source_Level3"] : "");
            
            header3.html((d.depth > 3) ? d["Category"] : "");
            //if (d.depth > 3) header2.html(header2.html() + " - " + d["source_Level4"]);
            if (d.depth > 4) header2.html(header2.html() + " - " + d["source_"+sourceFields[sourceFields.length-1]]);
            
            for (var i = 0; i < sumFields.length; i++) {

                //var condSpend = document.getElementById(sumFields[i]+"Spend");
                var condSpend = d3.select(document.getElementById(sumFields[i]+"Spend"));
                console.log("condSpend ",condSpend);
                /*if (d.depth <4) {
                    
                    condSpend.text(formatCurrency(d["sum_"+sumFields[i]]));
                }
                else {
                    condSpend.text("test");
                    condSpend.text(formatCurrency(d["sum_"+sumFields[i]]));
                }*/
                condSpend.text(formatCurrency(d["sum_"+sumFields[i]]));
            }
            
            
            //var tooltipWidth = (conditions.length+2)*100;
            var tooltipWidth = (conditions.length+2)*70;
            //toolTip.style("width",tooltipWidth+"px");
            toolTip.style("height",tooltipWidth+"px");
            toolTip.style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 75) + "px");

            d3.select(labels[d.key]).transition().style("font-weight","bold").style("font-size","16");;
            d3.select(circles[d.key]).transition().style("fill-opacity",0.6);
            highlightPath(d);

            function highlightPath(d) {
                if (d) {
                    d3.select(paths[d.key]).style("stroke-opacity",function (d) {return d.target[spendField] <= 0 ? .1 + .3 : ((d.source.depth + 1) / 4.5) + .3;});
                    highlightPath(d.parent);
                }
            }



        }

        function node_onMouseOut(d) {
            toolTip.transition()
                .duration(500)
                .style("opacity", "0");

            d3.select(labels[d.key]).transition().style("font-weight","normal").style("font-size","12");
            d3.select(circles[d.key]).transition().style("fill-opacity",0.3);
            noHighlightPath(d);

            function noHighlightPath(d) {
                if (d) {
                    d3.select(paths[d.key]).style("stroke-opacity",function (d) {return d.target[spendField] <= 0 ? .1 : ((d.source.depth + 1) / 4.5);});
                    noHighlightPath(d.parent);
                }
            }
        }


    }



    function toggleNodes(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
    }

    function toggleButtons(index) {
        d3.selectAll(".button").attr("class",function (d,i) { return (i==index) ? "button selected" : "button"; });
        d3.selectAll(".tip").attr("class",function (d,i) { return (i==index) ? "tip selected" : "tip";});
    }
    function expand(d){   
        var children = (d.children)?d.children:d._children;
        if (d._children) {        
            d.children = d._children;
            d._children = null;       
        }
        if(children)
          children.forEach(expand);
    }

    function expandAll(){
        expand(root); 
        update(root);
    }

    // Toggle children on click.
    function click(d) {
      
        /*if (d.numChildren > 500) {
                    alert(d.key + " has too many nodes (" + d.numChildren + ") to view at once.");
        }*/
        var children = (d.children)?d.children:d._children;
        if (children != null){
            if (children.length != 0){
                toggleNodes(d);
                update(d);
            }
        }
            
        
    }
    // find a node and expand all 
    function find(d, name) {
        //console.log("!!"+d.Category+" "+d.id+" "+d.key );
        if (d.key == name){

            console.log("name Find !!!" +name);
            console.log("name Find Parent!!!" +d.parent.key);
            
            while(d.parent){
                //if(d.parent != root){
                    d = d.parent;
                    if (d!= root){
                        click(d);//if found open its parent
                    }
                //}   
            }
        
            return;
        }

        //recursively call find function on its children
        if (d.children) {
            d.children.forEach(function(d){find(d, name)});
        }
        else if(d._children){
            d._children.forEach(function(d){find(d, name)});
        }
    }

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(function(d1){d1.parent = d; collapse(d1);});
            //d.children = null;
        }
    }

    // Create the export function - this will just export 
    // the first svg element it finds
    function svgToCanvas(){
        // Select the first svg element

         var svg = d3.select("svg"),
            img = new Image(),
            serializer = new XMLSerializer(),
            width = svg.node().getBBox().width,
            height = svg.node().getBBox().height;


        var style = "\n";
        var requiredSheets = ['treeWeight.css']; // list of required CSS
        for (var i=0; i<document.styleSheets.length; i++) {
            var sheet = document.styleSheets[i];
            if (sheet.href) {
                var sheetName = sheet.href.split('/').pop();
                if (requiredSheets.indexOf(sheetName) != -1) {
                    var rules = sheet.rules;
                    if (rules) {

                        for (var j=0; j<rules.length; j++) {
                            console.log(rules[j].cssText)
                            style += (rules[j].cssText + '\n');
                        }
                    }
                }
            }
        }

        //shared/bootstrap/css/bootstrap.min.css
        // prepend style to svg
        svg.insert('defs',":first-child")
        d3.select("svg defs")
            .append('style')
            .attr('type','text/css')
            .html(style);


        // generate IMG in new tab
        var svgStr = serializer.serializeToString(svg.node());
        img.src = 'data:image/svg+xml;base64,'+window.btoa(unescape(encodeURIComponent(svgStr)));
        window.open().document.write('<img src="' + img.src + '"/>');
            var svg = d3.select("svg")[0][0],
                img = new Image(),
                serializer = new XMLSerializer(),
                svgStr = serializer.serializeToString(svg);

        //img.src = 'data:image/svg+xml;base64,'+window.btoa(svgStr);

        // You could also use the actual string without base64 encoding it:
        /*img.src = "data:image/svg+xml;utf8," + svgStr;

        var canvas = document.createElement("canvas");
        document.body.appendChild(canvas);

        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img,0,0,w,h);
        // Now save as png or whatever*/
    };

}
