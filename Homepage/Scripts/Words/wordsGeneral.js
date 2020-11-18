var WordsGeneral = {};

/**
 * @return {string}
 */
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

WordsGeneral.FilterDataOnGroup = function (graph, group) {

    var filteredNodes = [];
    for (var i = 0; i < graph.nodes.length; i++) {
        var n = graph.nodes[i];

        if (n.group === group || group === -1) {
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

    output.Height = 50;
    output.Width = 50;

    var parentElement = document.getElementById(containerId);
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
        output.LinkDistance = svg.attr("linkdistance");
    }
    if (svg.attr("attractforce-strength") != null) {
        output.AttractForce.Strength = svg.attr("attractforce-strength");
    }
    if (svg.attr("attractforce-distancemax") != null) {
        output.AttractForce.DistanceMax = svg.attr("attractforce-distancemax");
    }
    if (svg.attr("attractforce-distancemin") != null) {
        output.AttractForce.DistanceMin = svg.attr("attractforce-distancemin");
    }
    if (svg.attr("repelforce-strength") != null) {
        output.RepelForce.Strength = svg.attr("repelforce-strength");
    }
    if (svg.attr("repelforce-distancemax") != null) {
        output.RepelForce.DistanceMax = svg.attr("repelforce-distancemax");
    }
    if (svg.attr("repelforce-distancemin") != null) {
        output.RepelForce.DistanceMin = svg.attr("repelforce-distancemin");
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