document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();
    
    if (users.find(u => u.email === email)) {
        alert('Email already exists');
        return;
    }
    
    const newUser = {
        name: name,
        email: email,
        password: password,
        role: 'user'
    };
    
    await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newUser)
    });
    
    alert('Registration successful!');
    window.location.href = 'index.html';
});