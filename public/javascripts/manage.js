function refreshPage() {
    setTimeout(function() {
        window.location.reload(); //refresh page so that car gets removed from page
    });
}

function deleteCar(car) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/manage-cars/" + car, true); //delete request for car with the right id
    xhttp.send();
    refreshPage();
}