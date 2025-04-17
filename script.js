document.getElementById('Form').addEventListener('submit', async (event) => {
    console.log("Form Submitted");
    event.preventDefault(); // Stop form from sending GET request

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('Password').value.trim();
    const emailField = document.getElementById('email'); // Optional for login
    const email = emailField ? emailField.value.trim() : null;
    const errorMessage = document.getElementById('error-message');

    const isLogin = emailField === null; // If email is missing, it's login
    const endpoint = isLogin ? "http://127.0.0.1:5000/login" : "http://127.0.0.1:5000/register";

    // Form data
    const formData = { username, password };
    if (!isLogin) formData.email = email; // Add email for register

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            alert(isLogin ? "Login successful!" : "Registration successful! Please log in.");
            window.location.href = isLogin ? "dashboard.html" : "index.html";
        } else {
            errorMessage.innerText = data.error || "Something went wrong!";
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        errorMessage.innerText = "Failed to connect to the server.";
    }
});
