function refreshPage() {
    window.location.reload();
}

function deleteCar(car) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/manage-cars/" + car, true);
    xhttp.send();
    refreshPage();
}