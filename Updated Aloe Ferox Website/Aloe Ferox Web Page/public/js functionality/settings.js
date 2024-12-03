// Function to fetch user data and display it
function fetchUserData() {
    fetch('/auth/user')
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        } else {
            // Update username display from database
            document.querySelector('#username-label').innerText = data.username; 
            // Update email
            document.querySelector('#user-email').innerText = data.email; 
            // Update date joined display from database
            document.querySelector('#date-joined').innerText = new Date(data.dateJoined).toLocaleDateString(); 
            // Set dark mode checkbox display from database
            document.getElementById('dark-mode-switch').checked = data.darkMode; 
            // Apply dark mode if enabled from database
            if (data.darkMode) {
                document.body.classList.add('dark-mode');
                document.documentElement.classList.add('dark-mode');
                updateBackButtonImage(true);  // Use dark mode back button on load
            } else {
                updateBackButtonImage(false); // Use light mode back button on load
            }
            // Update profile image display from database
            const profileImage = document.querySelector('.profile');
            profileImage.src = data.profileImage;
        }
    })
    .catch(error => console.error('Error fetching user data:', error));
}

// Function to update back button image based on dark mode
function updateBackButtonImage(isDarkMode) {
    const backImage = document.getElementById('back-image');

    if (isDarkMode) {
        backImage.src = 'Settings_Images/back dark.png'; // Dark mode image
    } else {
        backImage.src = 'Settings_Images/back.png'; // Light mode image
    }
}

// Function to toggle dark mode
function toggleDarkMode() {
    const isDarkMode = document.getElementById('dark-mode-switch').checked;
    
    // Make a PATCH request to update dark mode preference
    fetch('/auth/update-dark-mode', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ darkMode: isDarkMode }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Dark mode preference updated') {
            // Toggle the dark mode class on both body and html elements
            document.body.classList.toggle('dark-mode', isDarkMode);
            document.documentElement.classList.toggle('dark-mode', isDarkMode);
            updateBackButtonImage(isDarkMode); // Update back button image when dark mode changes
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error updating dark mode preference:', error));
}

// Call toggleDarkMode when the page loads to apply saved dark mode setting
window.onload = function() {
    fetchUserData(); // Fetch user data and apply preferences
    const isDarkMode = document.getElementById('dark-mode-switch').checked;
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
    updateBackButtonImage(isDarkMode); // Update back button image based on current mode
};

// Call fetchUserData when the page loads
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('dark-mode-switch').addEventListener('change', toggleDarkMode);
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
        .catch(error => console.error('Error deleting account:', error));
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
                // Successfully updated the profile image
            } else {
                console.error('Error:', data.message);
                alert('Error updating profile image');
            }
        })
        .catch(error => console.error('Error:', error));
    });
});