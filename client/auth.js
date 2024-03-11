var form = document.querySelector('#login');
var errorMessage = document.querySelector('#error-message');

form.onsubmit = function (evt) {
  evt.preventDefault();
  var username = document.querySelector('input[name="username"]').value;
  var password = document.querySelector('input[name="password"]').value;

  console.log('Sending login request...');
  fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then(function (response) {
      if (response.status === 200 || response.status === 201) {
        return response.json().then(function (data) {
          window.localStorage.setItem('token', data.access_token);
          console.log('Token stored:', data.access_token);
          errorMessage.style.display = 'none'; // Clear error message
        });
      } else {
        return response.json().then(function (errorData) {
          console.log('Error data received:', errorData);
          throw new Error('Error: ' + errorData.message);
        });
      }
    })
    .catch(function (error) {
      errorMessage.textContent = 'Failed to login. Please check your username and password.';
      errorMessage.style.display = 'block';
      console.error('Error:', error);
    });
};


var signupButton = document.querySelector('#signup');
signupButton.addEventListener('click', function (evt) {
  evt.preventDefault();

  var username = document.querySelector('input[name="username"]').value;
  var password = document.querySelector('input[name="password"]').value;

  var userData = { username, password };

  fetch('http://localhost:3000/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('Signup successful:', data);
    })
    .catch(function (error) {
      console.error('Error:', error);
    });
});
