function GridElement(startX, startY, x, y, number) {
    var id = "_" + x + "_" + y;
    var r = {
        id: "r" + id,
        x: 100,
        y: 50,
        width: 40,
        height: 40,
        stroke: 'black',
        'stroke-width': 2,
        fill: 'red'
    };

    r.x = startX + (r.width * x);
    r.y = startY + (r.height * y);

    var t = {
        id: "t" + id,
        x: 100,
        y: 50,
        fontSize: "10px",
        width: 40,
        height: 40,
        stroke: 'black',
        'text-anchor':"middle"
    };   
    t.x = r.x + (r.width/2);
    t.y = r.y + (r.height / 2);

    var rect = makeSVG('rect', r);
    var text = makeSVG('text', t);

    var obj = {
        rectangle: r,
        text: t,
        x: x,
        y: y,
        textValue: number.toString(),
        dom: {
            rect: rect,
            text: text
        }
    }
    return obj;
}
