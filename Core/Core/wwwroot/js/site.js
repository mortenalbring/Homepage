if (document.getElementById("dateval")) {
    var dv = $('#dateval');
    if (dv) {
        var textVal = dv.text();
        var mom = moment(textVal);
        console.log(mom.fromNow());
        var fromNowText = "(" + mom.fromNow() + ")";
        var niceText = mom.format("dddd [the] Do MMMM YYYY ")
        $('#datevalago').text(fromNowText);
        $('#datevalnice').text(niceText);
        $('#dateval').hide();
    }
}
