var date = new Date();

var month = date.getMonth()+1;
var day = date.getDate();

var today = date.getFullYear() + '-' +
    ((''+month).length<2 ? '0' : '') + month + '-' +
    ((''+day).length<2 ? '0' : '') + day;

$( document ).ready(function() {
    $('.todaysdate').val(today);
});