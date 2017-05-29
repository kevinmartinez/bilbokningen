function validateDate(carid, callback) {
    // today is a variable with the value of this days date from todaysdate.js
    var datefrom = document.getElementById('datefrom_' + carid).value;
    var dateto = document.getElementById('dateto_' + carid).value;

    if (datefrom >= today && dateto >= today) {

        if (dateto >= datefrom) {
            // Check if the date is aviable in the DB.

            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/bookings/" + carid, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState === XMLHttpRequest.DONE) {
                    if (xhttp.responseText == 'true') {
                        alert('Dates already booked!');
                        callback(false);
                    }
                    if (xhttp.responseText == 'false') {
                        callback(true);
                    }
                }
            }
            xhttp.send(JSON.stringify({ 'startDate': datefrom, 'endDate': dateto }));
        } else {
            alert("The day you deliver the car have to be later or the same day as you pick up the car!");
            return false;
        }
    } else {
        alert("You can not pick a date that is before today!");
        return false;
    }

}

// Send update car to server to add filterBooking

function bookCar(carid) {
    // TODO: Check if the date is aviable.
    console.log('we are in bookCar');
    validateDate(carid, function(isValidated) {
        if (isValidated) {
            var startDate = document.getElementById('datefrom_' + carid).value;
            var endDate = document.getElementById('dateto_' + carid).value;
            var email = document.getElementById('email_' + carid).value;

            var xhttp = new XMLHttpRequest();
            xhttp.open("PATCH", "/" + carid, true);
            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify({ 'startDate': startDate, 'endDate': endDate, 'email': email }));

            alert('car has successfully been boked');
        }
    });
}

// function for unbooking a car