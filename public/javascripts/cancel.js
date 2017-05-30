function cancelBooking(booking, button) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("PATCH", "/cancel/" + booking, true); //request to remove update from id
    xhttp.send();

    button.previousSibling.style.display = 'none'; //for user friendlyness : hide the booking 
    button.style.display = 'none';
}