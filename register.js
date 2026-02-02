// Inicializar localStorage al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    initializeUsers();
});

// Función para inicializar el array de usuarios si no existe
function initializeUsers() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
}

// Función para obtener usuarios del localStorage
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Función para guardar usuarios en localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Función para validar email
function isValidEmail(email) {
    return email.includes('@');
}

// Función para verificar si el email ya existe
function emailExists(email) {
    const users = getUsers();
    return users.some(user => user.email === email);
}

// Manejar el formulario de registro
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener valores de los campos
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    // Validación 1: Campos vacíos
    if (!name) {
        alert('Please enter your full name');
        return;
    }
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    if (!password) {
        alert('Please enter a password');
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
    
    // Validación 5: Email único
    if (emailExists(email)) {
        alert('This email is already registered. Please use a different email.');
        return;
    }
    
    // Si todas las validaciones pasan, crear nuevo usuario
    const users = getUsers();
    
    const newUser = {
        id: Date.now(), // ID único basado en timestamp
        name: name,
        email: email,
        password: password,
        role: role
    };
    
    // Agregar nuevo usuario al array
    users.push(newUser);
    
    // Guardar en localStorage
    saveUsers(users);
    
    // Mostrar mensaje de éxito
    alert('Registration successful!');
    
    // Redirigir al login
    window.location.href = 'index.html';
});