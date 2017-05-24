window.onload = function() {
    var listItems = document.getElementsByClassName('optional');
    for (var i = 0; i < listItems.length; i++) {
        listItems[i].style.display = (document.getElementById('user').innerText == '') ? 'inline-block' : 'none';
    }

    document.getElementById('manager-only').style.display = (document.getElementById('user').innerText == 'admin@admin') ? 'inline-block' : 'none';
    document.getElementById('logout').style.display = (document.getElementById('user').innerText == '') ? 'none' : 'inline-block';

    if (window.location.href.indexOf('cancel') != -1) {
        console.log('in cancel')
        document.getElementById('cancel').style.display = (document.getElementById('user').innerText == '') ? 'none' : 'inline-block';
    }

}