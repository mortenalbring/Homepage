function makeSVG(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}



function makeGrid(width,height) {  
    var startX = 100;
    var staryY = 50;
    var number = 0;
    var gridElements = [];
    for (var _y = 0; _y < height; _y++) {
        for (var _x = 0; _x < width; _x++) {
            number++;
            var gridelem = new GridElement(startX, staryY, _x, _y, number);
            gridElements.push(gridelem);
            document.getElementById('test').appendChild(gridelem.dom.rect);
            document.getElementById('test').appendChild(gridelem.dom.text).textContent = gridelem.textValue;
        }
    }       
}

function animateColor(gridElements) {
    var elem = 0;

    setInterval(function () {

        if (elem >= gridElements.length) {
            return;
        }
        var testgridobj = gridElements[elem];

        var testelem = document.getElementById(testgridobj.rectangle.id);

        if (testelem != null) {
            testelem.setAttribute('fill', 'green');

        }
        elem++;

    }, 1000)


}

$(document).ready(function () {

    makeGrid(16,16);
})

