// Código simple de principiante
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    // Get users from JSON Server
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    
    if (user) {
        localStorage.setItem('session', JSON.stringify(user));
        if (role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'user.html';
        }
    } else {
        alert('Invalid credentials');
    }
});