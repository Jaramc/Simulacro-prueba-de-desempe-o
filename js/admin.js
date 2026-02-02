// Variables globales
let currentAdmin = null;
let orders = [];
let products = [];

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    convertOrderStatus(); // Convertir estados antiguos
    loadOrders();
    loadProducts();
    updateDashboard();
    displayOrders();
    displayProducts();
});

// Verificar que el usuario sea admin
function checkAuthentication() {
    const session = localStorage.getItem('session');
    if (!session) {
        alert('Please login first');
        window.location.href = 'index.html';
        return;
    }
    
    currentAdmin = JSON.parse(session);
    if (currentAdmin.role !== 'admin') {
        alert('Access denied. Admin role required.');
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('adminName').textContent = 'Welcome, ' + currentAdmin.name + '!';
}

// Convertir estados de orden en español a inglés
function convertOrderStatus() {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
        const ordersArray = JSON.parse(savedOrders);
        let changed = false;
        
        ordersArray.forEach(order => {
            if (order.status === 'Pendiente') {
                order.status = 'pending';
                changed = true;
            } else if (order.status === 'En proceso') {
                order.status = 'preparing';
                changed = true;
            } else if (order.status === 'Entregado') {
                order.status = 'delivered';
                changed = true;
            } else if (order.status === 'Cancelado') {
                order.status = 'cancelled';
                changed = true;
            }
        });
        
        if (changed) {
            localStorage.setItem('orders', JSON.stringify(ordersArray));
        }
    }
}

// Cargar órdenes desde localStorage
function loadOrders() {
    const savedOrders = localStorage.getItem('orders');
    orders = savedOrders ? JSON.parse(savedOrders) : [];
}

// Cargar productos desde localStorage
function loadProducts() {
    const savedProducts = localStorage.getItem('products');
    products = savedProducts ? JSON.parse(savedProducts) : [];
}

// Actualizar métricas del dashboard
function updateDashboard() {
    const today = new Date().toLocaleDateString();
    
    // Total de órdenes
    document.getElementById('totalOrders').textContent = orders.length;
    
    // Órdenes pending
    const pendingCount = orders.filter(order => order.status === 'pending').length;
    document.getElementById('pendingOrders').textContent = pendingCount;
    
    // Ingresos de hoy
    let todayRevenue = 0;
    orders.forEach(order => {
        if (order.createdAt.includes(today)) {
            todayRevenue += order.total;
        }
    });
    document.getElementById('todayRevenue').textContent = '$' + todayRevenue.toFixed(2);
    
    // Órdenes recientes (últimas 5)
    const recentCount = Math.min(orders.length, 5);
    document.getElementById('recentOrders').textContent = recentCount;
}

// Mostrar órdenes en la tabla
function displayOrders() {
    const ordersTable = document.getElementById('ordersTable');
    ordersTable.innerHTML = '';
    
    orders.forEach(order => {
        const row = `
            <tr>
                <td>${order.id}</td>
                <td>${order.userName}</td>
                <td>${order.createdAt}</td>
                <td><span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></td>
                <td>$${order.total.toFixed(2)}</td>
                <td><button class="btn btn-sm btn-primary" onclick="viewOrder(${order.id})">View</button></td>
            </tr>
        `;
        ordersTable.innerHTML += row;
    });
}

// Obtener color para el badge del status
function getStatusColor(status) {
    switch(status) {
        case 'pending': return 'warning';
        case 'preparing': return 'info';
        case 'delivered': return 'success';
        case 'cancelled': return 'danger';
        default: return 'secondary';
    }
}

// Ver detalle de una orden
function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    let itemsHtml = '';
    order.items.forEach(item => {
        const subtotal = item.price * item.qty;
        itemsHtml += `<p>${item.name} x ${item.qty} = $${subtotal.toFixed(2)}</p>`;
    });
    
    const detailHtml = `
        <div>
            <h5>Order #${order.id}</h5>
            <p><strong>Customer:</strong> ${order.userName}</p>
            <p><strong>Date:</strong> ${order.createdAt}</p>
            <p><strong>Current Status:</strong> <span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></p>
            <hr>
            <h6>Items:</h6>
            ${itemsHtml}
            <hr>
            <h5>Total: $${order.total.toFixed(2)}</h5>
            
            <div class="mt-3">
                <label for="statusSelect" class="form-label">Change Status:</label>
                <select class="form-select mb-2" id="statusSelect">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
                <button class="btn btn-success" onclick="updateOrderStatus(${order.id})">Update</button>
            </div>
        </div>
    `;
    
    document.getElementById('orderDetail').innerHTML = detailHtml;
}

// Actualizar status de orden
function updateOrderStatus(orderId) {
    const newStatus = document.getElementById('statusSelect').value;
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        order.status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Refrescar vista
        displayOrders();
        updateDashboard();
        viewOrder(orderId); // Mantener el detalle visible
        
        alert('Order status updated successfully!');
    }
}

// Mostrar productos en la tabla
function displayProducts() {
    const productsTable = document.getElementById('productsTable');
    productsTable.innerHTML = '';
    
    products.forEach(product => {
        const row = `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td>${product.category}</td>
                <td>${product.image}</td>
                <td><button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">Delete</button></td>
            </tr>
        `;
        productsTable.innerHTML += row;
    });
}

// Manejar formulario de nuevo producto
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const image = document.getElementById('productImage').value.trim();
    
    // Validación básica
    if (!name) {
        alert('Product name is required');
        return;
    }
    
    if (price <= 0) {
        alert('Price must be greater than 0');
        return;
    }
    
    // Crear nuevo producto
    const newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        category: category,
        image: image || 'images/default.jpg'
    };
    
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    
    // Refrescar vista
    displayProducts();
    document.getElementById('productForm').reset();
    
    alert('Product added successfully!');
});

// Eliminar producto
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
        alert('Product deleted successfully!');
    }
}

// Cerrar sesión
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('session');
        window.location.href = 'index.html';
    }
}