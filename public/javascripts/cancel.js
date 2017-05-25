function cancelBooking(booking, button) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("PATCH", "/cancel/" + booking, true);
    xhttp.send();

    button.previousSibling.style.display = 'none';
    button.style.display = 'none';
}