function validateDate(carid) {
	// today is a variable with the value of this days date from todaysdate.js
	var datefrom = document.getElementById('datefrom_' + carid).value;
	var dateto = document.getElementById('dateto_' + carid).value;

    if(datefrom >= today && dateto >= today) {
    	
    	if(dateto >= datefrom) {
    		// Check if the date is aviable in the DB.
    		if(true) {
    			return true;
    		} else {
    			alert("One of your days is taken!");
    		}
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
	// Check if the date is aviable.
	var validate = validateDate(carid);

	if (validate) {
		var xhttp = new XMLHttpRequest(carid);
        xhttp.open("PATCH", "/" + carid, true);
        xhttp.send();
        // refreshPage(); 
        alert('car has successfully been boked');
	}
}

// function for unbooking a car