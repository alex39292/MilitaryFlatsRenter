const buttonUsers = document.getElementById('users');
const buttonHomes = document.getElementById('homes');
const buttonMessage = document.getElementById('message');

buttonUsers.addEventListener('click', function(e) {
    fetch('/', {
        method: 'POST',
        body: JSON.stringify({ buttonUsers: true }),
        headers: {
            'Content-Type': 'application/json'
          }
    });
});

buttonHomes.addEventListener('click', function(e) {
    fetch('/', {method: 'POST'});
});

buttonMessage.addEventListener('click', function(e) {
    fetch('/', {method: 'POST'});
});