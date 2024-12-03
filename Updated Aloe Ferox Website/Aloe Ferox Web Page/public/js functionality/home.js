// Array of Aloe Ferox facts
const facts = [
    "Aloe Ferox can live up to 100 years and has been used for centuries in traditional medicine for its healing properties.",
    "Aloe ferox is native to South Africa, thriving in the Eastern and Western Cape regions. It flourishes in arid and semi-arid climates, adapting well to harsh environments.",
    "This succulent can grow up to 3 meters (10 feet) tall, featuring thick, fleshy, lance-shaped leaves that reach lengths of up to 1 meter (3 feet). Its striking appearance makes it a popular ornamental plant.",
    "Leaves are harvested for their gel and sap, but sustainable harvesting practices are vital. Overexploitation can threaten the plant populations and their ecosystems.",
    "Aloe ferox is highly drought-resistant, making it ideal for cultivation in arid regions. It is a favored choice for xeriscaping gardens, reducing water consumption.",
    "Aloe ferox is increasingly popular in the cosmetic and pharmaceutical industries, with products ranging from skin creams to dietary supplements. Its versatility showcases its health benefits.",
    "Aloe ferox produces vibrant tubular flowers in bright orange or red, which bloom on tall spikes. These flowers attract various birds and insects, contributing to local biodiversity."
];

// Function to display a random fact
function displayRandomFact() {
    const randomIndex = Math.floor(Math.random() * facts.length);
    const factElement = document.getElementById('fact-of-the-day');
    factElement.textContent = facts[randomIndex];
}

// Call the function when the page loads
window.onload = displayRandomFact;

// Contact form
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Send the message to the server
    fetch('/messages/submit-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Show success message
        document.getElementById('contact-form').reset(); // Reset the form
    })
    .catch(error => console.error('Error submitting message:', error));
});