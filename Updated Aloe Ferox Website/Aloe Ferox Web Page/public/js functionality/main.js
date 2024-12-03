// Function to display the welcome message
function displayWelcomeMessage() {
    const userData = JSON.parse(localStorage.getItem('userData')); // Retrieve user data from local storage
    if (userData && userData.username) {
        document.getElementById('welcome-message').innerText = `Welcome, ${userData.username}! We are glad to have you here and can't wait to teach you more about Aloe Ferox.`;
    }
}

// Function to fetch user data and display it
function fetchUserData() {
    fetch('/auth/user')
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            } else {
                // Update profile image display from database
                const profileImage = document.getElementById('profile-image'); // Use the correct ID
                if (profileImage) {
                    profileImage.src = data.profileImage; // Update profile image on main page
                } else {
                    alert('Profile image element not found.');
                }

                // Apply dark mode if set in database
                if (data.darkMode) {
                    document.body.classList.add('dark-mode');
                    document.documentElement.classList.add('dark-mode');
                }
            }
        })
        .catch(error => alert('Error fetching user data: ' + error.message));
}

// Call necessary functions when the page loads
window.onload = function() {
    displayWelcomeMessage(); // Display welcome message
    fetchUserData();         // Fetch and display user data
};

// Handle adding an image from the user's device
document.getElementById('add-image-btn').addEventListener('click', function() {
    document.getElementById('fileInput').click(); // Open file dialog
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Get the selected file
    const generateResultsBtn = document.getElementById('generate-results-btn');
    
    if (file) {
        const reader = new FileReader(); // Create a FileReader to read the file
        reader.onload = function(e) {
            document.getElementById('ferox-image').src = e.target.result; // Set the image source to the selected file
            generateResultsBtn.disabled = false; // Enable the "Generate Results" button
            generateResultsBtn.classList.remove('disabled'); // Remove the disabled class
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    } else {
        generateResultsBtn.disabled = true; // Keep the button disabled if no file is selected
        generateResultsBtn.classList.add('disabled'); // Add the disabled class
    }
});

// Function to delete the user's account
function deleteAccount() {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        // Make a DELETE request to delete the account
        fetch('/auth/delete-account', {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Account deleted successfully') {
                alert('Account deleted successfully');
                // Redirect to home page or log the user out
                window.location.href = 'Home.html';
            } else {
                alert(data.message);
            }
        })
        .catch(error => alert('Error deleting account: ' + error.message));
    }
}

// Show the image selection when the "Change Profile Picture" button is clicked
document.getElementById('change-image-btn').addEventListener('click', function() {
    const imageSelectionDiv = document.getElementById('image-selection');
    imageSelectionDiv.style.display = imageSelectionDiv.style.display === 'none' ? 'block' : 'none';
});

// Handle image selection
document.querySelectorAll('.selectable-image').forEach(function(image) {
    image.addEventListener('click', function() {
        const selectedImage = this.getAttribute('data-image');

        // Update the displayed profile image on the frontend
        document.getElementById('profile-image').src = selectedImage;

        // Hide the image selection options immediately after an image is selected
        document.getElementById('image-selection').style.display = 'none';

        // Send the selected image to the server to update the user's profile image
        fetch('/auth/update-profile-image', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ profileImage: selectedImage }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Profile image updated successfully') {
                // Profile image updated successfully
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => alert('Error: ' + error.message));
    });
});

