document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = {
        email: this.email.value,
        username: this.username.value,
        password: this.password.value
    };

    fetch('/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.redirectUrl) {
            // Store user data in local storage
            localStorage.setItem('userData', JSON.stringify(data.userData));
            
            // Redirect to Main.html
            window.location.href = data.redirectUrl;
        } else {
            console.error(data.message); // Log error messages if any
            alert(data.message); // Show error message to the user
        }
    })
    .catch(error => console.error('Error:', error));
});