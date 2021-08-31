var WordsGeneral = {};


WordsGeneral.GetDiffChar = function (source, target) {
    var diffChar = "";
    for (var oo = 0; oo < source.length; oo++) {
        var charats = source.charAt(oo);
        if (oo < target.length) {
            var charatt = target.charAt(oo);
            if (charats !== charatt) {
                diffChar = charats;
                break;
            }
        } else {
            diffChar = charats;
        }
    }
    return diffChar;
};

WordsGeneral.FilterDataOnTerm = function (inputGraph, term) {

    
    var newGraph = {};
    
    console.log("filtering to term " + term);
    var maxresults = 1000;
    var filteredNodes = [];
    for (var i = 0; i < inputGraph.nodes.length; i++) {
        var n = inputGraph.nodes[i];

        if (term != null && term.length > 1 && n.id.includes(term) && filteredNodes.length < maxresults) {
            var exists = false;
            for (var b = 0; b < filteredNodes.length; b++) {
                if (filteredNodes[b].id === n.id) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                filteredNodes.push(n);
            }
        }
    }
    
    newGraph.nodes = filteredNodes;
    console.log("ngnlength:" + newGraph.nodes.length);
    console.log("ngnlength:" + inputGraph.links.length);
    console.log(newGraph.nodes);
    var filteredLinks = [];
    for (var j = 0; j < inputGraph.links.length; j++) {
        var searchLink = inputGraph.links[j];
        var source = searchLink.source;
        var target = searchLink.target;

        var founds = false;
        var foundt = false;
        for (var l = 0; l < newGraph.nodes.length; l++) {
            var searchNode = newGraph.nodes[l];
            
            if (l === 0 && j === 0) {
                console.log(searchNode);    
            }
            if (searchNode.id === source) {
                founds = true;
            }
            if (searchNode.id === target) {
                foundt = true;
            }
        }
        if (founds && foundt) {
            searchLink.diffChar = WordsGeneral.GetDiffChar(source, target);
            filteredLinks.push(searchLink);
        }
   
    }
    newGraph.links = filteredLinks;
    
    return newGraph;
};


WordsGeneral.FilterDataOnGroup = function (graph, group) {

    console.log("filtering to group " + group);
    var filteredNodes = [];
    for (var i = 0; i < graph.nodes.length; i++) {
        var n = graph.nodes[i];

        if (n.group === group || group === -1 ) {
            var exists = false;
            for (var b = 0; b < filteredNodes.length; b++) {
                if (filteredNodes[b].id === n.id) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                filteredNodes.push(n);
            }
        }
    }
    graph.nodes = filteredNodes;
    var filteredLinks = [];
    for (var j = 0; j < graph.links.length; j++) {
        var searchLink = graph.links[j];
        var source = searchLink.source;
        var target = searchLink.target;

        var founds = false;
        var foundt = false;
        for (var l = 0; l < graph.nodes.length; l++) {
            var searchNode = graph.nodes[l];
            if (searchNode.id === source) {
                founds = true;
            }
            if (searchNode.id === target) {
                foundt = true;
            }
        }
        if (founds && foundt) {
            searchLink.diffChar = WordsGeneral.GetDiffChar(source, target);
            filteredLinks.push(searchLink);
        }
    }
    graph.links = filteredLinks;
console.log("done");
};

WordsGeneral.MakeCenterGroup = function(start,end,maxGroup) {
    var arr = [];
    var steps = (end - start) / maxGroup ;
    
     
    
    for (var i=0;i<=maxGroup;i++) {
        var elem = i * steps;
        arr.push(elem);
    }
    if (maxGroup == 10) {
        console.log(arr);
    }
    return arr;
}

WordsGeneral.ParseDomVariables = function (svg, containerId) {
    var output = {
    };
    output.LinkDistance = 40;
    output.MaxGroup = 1;
    output.Group = 1;
    output.JsonPath = "";
    output.AttractForce = {};
    output.AttractForce.Strength = 5;
    output.AttractForce.DistanceMax = 400;
    output.AttractForce.DistanceMin = 60;

    output.RepelForce = {};
    output.RepelForce.Strength = -40;
    output.RepelForce.DistanceMax = 80;
    output.RepelForce.DistanceMin = 10;
    output.UseForceYByHeight = false;
    output.UseForceYByGroup = false;
    output.UseForceXByGroup = false;
    
output.Charge = -80;

    output.Height = 50;
    output.Width = 50;

    var parentElement = document.getElementById(containerId);
    if (parentElement === null) {
        return;
    }
    var parentWidth = parentElement.clientWidth;
    var pheight = parentElement.clientHeight;


    if (svg.attr("height") != null) {
        output.Height = parseInt(svg.attr("height"));
    }
    if (svg.attr("width") != null) {
        output.Width = parseInt(svg.attr("width"));
    }
    if (svg.attr("group") != null) {
        output.Group = parseInt(svg.attr("group"));
    }
    if (svg.attr("maxgroup") != null) {
        output.MaxGroup = parseInt(svg.attr("maxgroup"));
    }
    if (svg.attr("linkdistance") != null) {
        output.LinkDistance = parseInt(svg.attr("linkdistance"));
    }
    if (svg.attr("attractforcestrength") != null) {
        output.AttractForce.Strength = parseInt(svg.attr("attractforcestrength"));
    }
    if (svg.attr("attractforcedistancemax") != null) {
        output.AttractForce.DistanceMax = parseInt(svg.attr("attractforcedistancemax"));
    }
    if (svg.attr("attractforcedistancemin") != null) {
        output.AttractForce.DistanceMin = parseInt(svg.attr("attractforcedistancemin"));
    }
    if (svg.attr("repelforcestrength") != null) {
        output.RepelForce.Strength = parseInt(svg.attr("repelforcestrength"));
    }
    if (svg.attr("repelforcedistancemax") != null) {
        output.RepelForce.DistanceMax = parseInt(svg.attr("repelforcedistancemax"));
    }
    if (svg.attr("repelforcedistancemin") != null) {
        output.RepelForce.DistanceMin = parseInt(svg.attr("repelforcedistancemin"));
    }
    
    if (svg.attr("charge") != null) {
        output.RepelForce.DistanceMin = parseInt(svg.attr("charge"));
    }

    if (svg.attr("useforceybyheight") != null) {
        output.UseForceYByHeight = true;
    }
    if (svg.attr("useforcexbygroup") != null) {
        output.UseForceXByGroup = true;
    }
    if (svg.attr("useforceybygroup") != null) {
        output.UseForceYByGroup = true;
    }


    if (svg.attr("json") != null) {
        output.JsonPath = svg.attr("json");
    }

    if (output.Width > parentWidth) {
        output.Width = parentWidth;
        svg.attr("width", output.Width);
    }

    return output;

};