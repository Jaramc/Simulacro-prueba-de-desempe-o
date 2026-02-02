// Función para obtener usuarios del localStorage
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Función para guardar sesión en localStorage
function saveSession(user) {
    const session = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };
    localStorage.setItem('session', JSON.stringify(session));
}

// Función para validar email
function isValidEmail(email) {
    return email.includes('@');
}

// Función para buscar usuario
function findUser(email, password, role) {
    const users = getUsers();
    return users.find(user => 
        user.email === email && 
        user.password === password && 
        user.role === role
    );
}

// Manejar el formulario de login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener valores de los campos
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    // Validación 1: Campos vacíos
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    if (!password) {
        alert('Please enter your password');
        return;
    }
    
    if (!role) {
        alert('Please select a role');
        return;
    }
    
    // Validación 2: Email válido
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Validación 3: Password mínimo 4 caracteres
    if (password.length < 4) {
        alert('Password must be at least 4 characters long');
        return;
    }
    
    // Validación 4: Role debe ser exactamente "user" o "admin"
    if (role !== 'user' && role !== 'admin') {
        alert('Please select a valid role');
        return;
    }
    
    // Verificar si existen usuarios registrados
    const users = getUsers();
    if (users.length === 0) {
        alert('No users registered. Please create an account first.');
        window.location.href = 'register.html';
        return;
    }
    
    // Buscar usuario con email, password y role
    const user = findUser(email, password, role);
    
    if (user) {
        // Usuario encontrado - iniciar sesión
        saveSession(user);
        alert('Login successful!');
        
        // Redirigir según el role
        if (role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'user.html';
        }
    } else {
        // Usuario no encontrado
        alert('User not registered, you must create an account');
        window.location.href = 'register.html';
    }
});