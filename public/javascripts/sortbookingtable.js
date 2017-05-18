function filterBooking() {
	var tdModel, tdSeats, tdAuto, tdRoofrack, tdPrice, i;
	var inputModel = document.getElementById("inputModel");
	var inputSeats = document.getElementById("inputSeats");
	var inputAuto = document.getElementById("inputAuto");
	var inputRoofrack = document.getElementById("inputRoofrack");
	var inputPrice = document.getElementById("inputPrice");
	var filterModel = inputModel.value.toUpperCase();
	var filterSeats = inputSeats.value.toUpperCase();
	var filterAuto = inputAuto.value.toUpperCase();
	var filterRoofrack = inputRoofrack.value.toUpperCase();
	var filterPrice = inputPrice.value.toUpperCase();
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
		    	tdPrice) 
		    {
			    if (tdModel.innerHTML.toUpperCase().indexOf(filterModel) > -1 &&
			    	tdSeats.innerHTML.toUpperCase().indexOf(filterSeats) > -1 &&
			    	tdAuto.innerHTML.toUpperCase().indexOf(filterAuto) > -1 &&
			    	tdRoofrack.innerHTML.toUpperCase().indexOf(filterRoofrack) > -1 &&
			    	tdPrice.innerHTML.toUpperCase().indexOf(filterPrice) > -1)
			    {
				    tr[i].style.display = "";
				} 
				else
				{
				    tr[i].style.display = "none";
				}
			}       
		}
	}
}