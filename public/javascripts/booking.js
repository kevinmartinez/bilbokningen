function validateDate(carid, callback) {
    // today is a variable with the value of this days date from todaysdate.js
    var datefrom = document.getElementById('datefrom_' + carid).value;
    var dateto = document.getElementById('dateto_' + carid).value;

    if (datefrom >= today && dateto >= today) {

        if (dateto >= datefrom) {
            // Check if the date is aviable in the DB.
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/bookings/" + carid, true); //send a post request to check if date is free
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState === XMLHttpRequest.DONE) {
                    if (xhttp.responseText == 'true') { //if date is taken for that car
                        alert('Dates already booked!');
                        callback(false);
                    }
                    if (xhttp.responseText == 'false') { //if date is free
                        callback(true);
                    }
                }
            }
            xhttp.send(JSON.stringify({ 'startDate': datefrom, 'endDate': dateto })); // send the dates picked from the user
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
    validateDate(carid, function(isValidated) { //callbakc function to check if date is free before booking
        if (isValidated) {
            var startDate = document.getElementById('datefrom_' + carid).value; //add dates to be sent to booking function
            var endDate = document.getElementById('dateto_' + carid).value;
            var email = document.getElementById('email_' + carid).value;

            var xhttp = new XMLHttpRequest();
            xhttp.open("PATCH", "/" + carid, true);
            xhttp.setRequestHeader("Content-type", "application/json");

            xhttp.send(JSON.stringify({ 'startDate': startDate, 'endDate': endDate, 'email': email })); //send information about booking, email for not logged in user
            alert('car has successfully been boked');
        }
    });
}

// function for unbooking a car