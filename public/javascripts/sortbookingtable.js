function filterBooking() {
    var tdModel, tdSeats, tdAuto, tdRoofrack, tdPrice, i;
    var inputModel = document.getElementById("inputModel");
    var inputSeats = document.getElementById("inputSeats");
    var inputAuto = document.getElementById("inputAuto");
    var inputRoofrack = document.getElementById("inputRoofrack");
    var inputPrice = document.getElementById("inputPrice");
    var filterModel = inputModel.value.toUpperCase();
    var filterSeats = inputSeats.value;
    var filterAuto = inputAuto.value.toUpperCase();
    var filterRoofrack = inputRoofrack.value.toUpperCase();
    var filterPrice = inputPrice.value;
    var table = document.getElementById("availableCars");
    var tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        if (i > 1) {
            tdModel = tr[i].getElementsByTagName("td")[0];
            tdSeats = tr[i].getElementsByTagName("td")[1];
            tdAuto = tr[i].getElementsByTagName("td")[2];
            tdRoofrack = tr[i].getElementsByTagName("td")[3];
            tdPrice = tr[i].getElementsByTagName("td")[4];
            if (tdModel &&
                tdSeats &&
                tdAuto &&
                tdRoofrack &&
                tdPrice) {
                if (tdModel.innerHTML.toUpperCase().indexOf(filterModel) > -1 &&
                    (parseFloat(tdSeats.innerHTML) >= parseFloat(filterSeats) ||
                        filterSeats == "") &&
                    tdAuto.innerHTML.toUpperCase().indexOf(filterAuto) > -1 &&
                    tdRoofrack.innerHTML.toUpperCase().indexOf(filterRoofrack) > -1 &&
                    (parseFloat(tdPrice.innerHTML) <= parseFloat(filterPrice) ||
                        filterPrice == "")) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("availableCars");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("TR");
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 2; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
    filterBooking();
}

function sortTableNum(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("availableCars");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("TR");
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 2; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
    filterBooking();
}
