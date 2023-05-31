// script.js

// Example JavaScript code to change the header text color on click
const header = document.querySelector('header');
header.addEventListener('click', function() {
  header.style.color = 'red';
});

// Example JavaScript code to display an alert when the contact form is submitted
const form = document.querySelector('form');
form.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevents the form from submitting

  alert('Thank you for submitting the form!');
});
