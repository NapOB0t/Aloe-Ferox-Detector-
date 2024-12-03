document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = {
        email: this.email.value,
        password: this.password.value
    };

    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            window.location.href = 'Main.html'; // Redirect on successful login
        } else {
            alert(data.message); // Show error message if login fails
        }
    })
    .catch(error => console.error('Error:', error));
});