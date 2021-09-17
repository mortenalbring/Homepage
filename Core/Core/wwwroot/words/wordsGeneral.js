var WordsGeneral = {};

WordsGeneral.DataArchive = {};
WordsGeneral.FilteredDataArchive = {};

WordsGeneral.CombineData = function(graphData, newData) {
    console.log("CombineData:");
    console.log(graphData);
    console.log("New Data:");
    console.log(newData);

    // for (let i = 0; i < graphData.length; i++) {
    //     graphData.nodes[i].new = false;
    // }
    //
    // for (let i = 0; i < newData.nodes.length; i++) {
    //     newData.nodes[i].new = true;
    // }
    
    var combinedData = {nodes: [], links: []};
    
    combinedData.nodes = graphData.nodes;
    combinedData.links = graphData.links;

    for (let i = 0; i < newData.nodes.length; i++) {
        var exists = false;
        for (let j = 0; j < combinedData.nodes.length; j++) {
            if (combinedData.nodes[j].id == newData.nodes[i].id) {
                combinedData.nodes[j].new = false;
                exists =  true;
                break;
            }
        }
        if (!exists) {
            newData.nodes[i].new = true;
            combinedData.nodes.push(newData.nodes[i]);
        }
    }

    for (let i = 0; i < newData.links.length; i++) {
        var exists = false;
        for (let j = 0; j < combinedData.links.length; j++) {
            if (combinedData.links[j].source == newData.links[i].source.id && combinedData.links[j].target.id == newData.links[i].target.id) {
                exists = true;
                break;
            }
            if (combinedData.links[j].source.id == newData.links[i].source && combinedData.links[j].target.id == newData.links[i].target) {
                exists = true;
                break;
            }


        }
        if (!exists) {
            console.log(newData.links[i]);
            combinedData.links.push(newData.links[i]);
        }
    }
    var updateData = JSON.parse(JSON.stringify(combinedData))
    return updateData;
}


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

WordsGeneral.FilterDataOnTermExactRecursive = function(inputGraph, term) {
    var newGraph = {};

    var searchLinks = [];

    var searchTerms = [];
    searchTerms.push(term);
    
    var foundTerms = [];
    
    for (var j = 0; j < inputGraph.links.length; j++) {
        var searchLink = inputGraph.links[j];
        var source = searchLink.source;
        var target = searchLink.target;

        for (let i = 0; i < searchTerms.length; i++) {
            if (source === searchTerms[i]) {
                if (foundTerms.indexOf(source) === -1) {
                    foundTerms.push(source);    
                }
                
                searchLinks.push(searchLink);
                if (searchTerms.indexOf(target) === -1) {
                    searchTerms.push(target);
                }
            }
            if (target === searchTerms[i]) {
                if (foundTerms.indexOf(target) === -1) {
                    foundTerms.push(target);
                }
                searchLinks.push(searchLink);
                if (searchTerms.indexOf(source) === -1) {
                    searchTerms.push(source);
                }
            }
        }
    }
    console.log("SearchRecurs:")
    console.log(searchTerms.length);
    console.log(foundTerms.length);

    var notFound = [];
    for (let i = 0; i < searchTerms.length; i++) {
        var found = foundTerms.indexOf(searchTerms[i]);
        if (found === -1) {
            notFound.push(searchTerms[i]);
        }
    }
    console.log("Not found " + notFound.length);
    
    
    var searchNodes = [];

    for (var i = 0; i < inputGraph.nodes.length; i++) {

        for (let j = 0; j < searchLinks.length; j++) {
            if ((inputGraph.nodes[i].id === searchLinks[j].source) || (inputGraph.nodes[i].id === searchLinks[j].target)) {
                var inArray = searchNodes.findIndex(v => v.id === inputGraph.nodes[i].id);
                if (inArray == -1) {
                    inputGraph.nodes[i].linkCount = 1;
                    searchNodes.push(inputGraph.nodes[i]);
                }
                else {
                    searchNodes[inArray].linkCount++;
                }
            }

        }
    }



    var newGraph = {};
    newGraph.nodes = searchNodes;
    newGraph.links = searchLinks;
    return newGraph;

}


WordsGeneral.FilterDataOnTermExact = function(inputGraph, term) {
    var newGraph = {};

    var searchLinks = [];
    
    for (var j = 0; j < inputGraph.links.length; j++) {
        var searchLink = inputGraph.links[j];
        var source = searchLink.source;
        var target = searchLink.target;

        if (source === term) {
            searchLinks.push(searchLink);
        }
        if (target === term) {
            searchLinks.push(searchLink);
        }
    }

    var searchNodes = [];
    
    for (var i = 0; i < inputGraph.nodes.length; i++) {

        for (let j = 0; j < searchLinks.length; j++) {
            if ((inputGraph.nodes[i].id === searchLinks[j].source) || (inputGraph.nodes[i].id === searchLinks[j].target)) {
                var inArray = searchNodes.findIndex(v => v.id === inputGraph.nodes[i].id);
                if (inArray == -1) {
                    inputGraph.nodes[i].linkCount = 1;
                    searchNodes.push(inputGraph.nodes[i]);
                }
                else {
                    searchNodes[inArray].linkCount++;
                }
            }
            
        }
    }
    
    
    var newGraph = {};
    newGraph.nodes = searchNodes;
    newGraph.links = searchLinks;
    return newGraph;
    
}

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
    var onlyLinkedNodes = [];
    var filteredLinks = [];
    for (var j = 0; j < inputGraph.links.length; j++) {
        var searchLink = inputGraph.links[j];
        var source = searchLink.source;
        var target = searchLink.target;

        var founds = false;
        var foundt = false;
        for (var l = 0; l < newGraph.nodes.length; l++) {
            var searchNode = newGraph.nodes[l];

            if (!searchNode.linkCount) {
                searchNode.linkCount = 0;
            }
            
            if (l === 0 && j === 0) {
                console.log("finding links");
                console.log(searchNode);    
                console.log(source);
                console.log(target);
            }
            if (searchNode.id === source || searchNode.id === source.id) {
                searchNode.linkCount++;
                founds = true;
            }
            if (searchNode.id === target || searchNode.id === target.id) {
                searchNode.linkCount++;
                foundt = true;
            }
            if (founds || foundt) {
                var inArray = onlyLinkedNodes.findIndex(v => v.id === searchNode.id);
                if (inArray == -1) {
                    onlyLinkedNodes.push(searchNode);
                }
            }
        }
        if (founds && foundt) {
            searchLink.diffChar = WordsGeneral.GetDiffChar(source, target);
            filteredLinks.push(searchLink);
        }
   
    }
    
    //newGraph.nodes = onlyLinkedNodes;
    var onlyLinks = filteredNodes.filter(function(e) { return e.linkCount > 0 });
    
    //newGraph.nodes = onlyLinks;
    newGraph.links = filteredLinks;
    
    var test = filteredNodes.filter(function(e) { return e.id === "mortally"});
    console.log(test);
    return newGraph;
    
};


WordsGeneral.FilterDataOnGroup = function (graph, group) {
    
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
    var output = {};
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
    
    output.ColorStyle = 0;

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

    if (svg.attr("colourstyle") != null) {
        output.ColorStyle = parseInt(svg.attr("colourstyle"));
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