window.onload = function() {
    var listItems = document.getElementsByClassName('optional');
    for (var i = 0; i < listItems.length; i++) {
        listItems[i].style.display = (document.getElementById('user').innerText == '') ? 'inline-block' : 'none';
    }

    document.getElementById('manager-only').style.display = (document.getElementById('user').innerText == 'admin@admin') ? 'inline-block' : 'none';
    document.getElementById('logout').style.display = (document.getElementById('user').innerText == '') ? 'none' : 'inline-block';
}

function logout() {
    console.log('im here')
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/logout", true);
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
            console.log(xhttp.responseText);
        }
    };
    xhttp.send();

}