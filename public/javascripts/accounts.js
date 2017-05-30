window.onload = function() {
    var listItems = document.getElementsByClassName('optional');
    for (var i = 0; i < listItems.length; i++) { //hide login and signup link when user is logged in, show when not
        listItems[i].style.display = (document.getElementById('user').innerText == '') ? 'inline-block' : 'none';
    }

    document.getElementById('manager-only').style.display = (document.getElementById('user').innerText == 'admin@admin') ? 'inline-block' : 'none'; //if admin is logged in, show link to manage cars
    document.getElementById('logout').style.display = (document.getElementById('user').innerText == '') ? 'none' : 'inline-block'; //if user is logged in, show logout button

    if (window.location.href.indexOf('cancel') != -1) { //if on cancel page
        console.log('in cancel')
        document.getElementById('cancel').style.display = (document.getElementById('user').innerText == '') ? 'inline-block' : 'none'; //if user not logged in - show form to fill in email
    }

    if (window.location.href.indexOf('/') != -1) { //if on index page
        var emailInput = document.getElementsByClassName('email-input');
        for (var i = 0; i < emailInput.length; i++) { //show email input field to book car if user is not logged in
            emailInput[i].style.display = (document.getElementById('user').innerText == '') ? 'inline-block' : 'none';
        }
    }

}