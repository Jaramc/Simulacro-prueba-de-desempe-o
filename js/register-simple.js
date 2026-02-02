// Código simple de principiante
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Check if email exists
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();
    
    if (users.find(u => u.email === email)) {
        alert('Email already exists');
        return;
    }
    
    // Create user with automatic "user" role
    const newUser = {
        name: name,
        email: email,
        password: password,
        role: 'user'  // AUTOMATIC
    };
    
    await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newUser)
    });
    
    alert('Registration successful!');
    window.location.href = 'index.html';
});