let currentUser = null;

const session = localStorage.getItem('session');
if (!session) {
    window.location.href = 'index.html';
} else {
    currentUser = JSON.parse(session);
    if (currentUser.role !== 'admin') {
        window.location.href = 'index.html';
    }
    document.getElementById('adminName').textContent = currentUser.name;
}

async function loadDashboard() {
    try {
        const response = await fetch('http://localhost:3000/orders');
        const orders = await response.json();
        
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter(o => o.date === today);
        const pendingOrders = orders.filter(o => o.status === 'pending');
        const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
        
        document.getElementById('totalOrders').textContent = orders.length;
        document.getElementById('pendingOrders').textContent = pendingOrders.length;
        document.getElementById('todayRevenue').textContent = '$' + todayRevenue.toFixed(2);
        
        showOrders(orders);
    } catch (error) {
        alert('Error al cargar datos del dashboard');
    }
}

function showOrders(orders) {
    let html = '';
    orders.forEach(order => {
        let statusBadge = '';
        switch(order.status) {
            case 'pending': statusBadge = '<span class="badge bg-warning">Pendiente</span>'; break;
            case 'preparing': statusBadge = '<span class="badge bg-info">Preparando</span>'; break;
            case 'delivered': statusBadge = '<span class="badge bg-success">Entregado</span>'; break;
            case 'cancelled': statusBadge = '<span class="badge bg-danger">Cancelado</span>'; break;
        }
        
        html += `
            <div class="card mb-2">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6>Pedido #${order.id} - ${order.userName}</h6>
                            <p class="mb-1">Total: $${order.total} | Fecha: ${order.date}</p>
                        </div>
                        <div>
                            ${statusBadge}
                            <select class="ms-2" onchange="changeStatus(${order.id}, this.value)">
                                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                                <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparando</option>
                                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Entregado</option>
                                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
                            </select>
                        </div>
                    </div>
                    <details class="mt-2">
                        <summary>Ver detalles</summary>
                        <ul class="mb-0 mt-2">
                            ${order.items.map(item => `<li>${item.name} x${item.qty} - $${(item.price * item.qty).toFixed(2)}</li>`).join('')}
                        </ul>
                    </details>
                </div>
            </div>
        `;
    });
    
    document.getElementById('ordersList').innerHTML = html;
}

async function changeStatus(orderId, newStatus) {
    try {
        await fetch(`http://localhost:3000/orders/${orderId}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({status: newStatus})
        });
        loadDashboard();
    } catch (error) {
        alert('Error al actualizar estado');
    }
}

function showAddProduct() {
    const html = `
        <div class="card mt-3" id="addProductCard">
            <div class="card-header">
                <h5>Agregar Nuevo Producto</h5>
            </div>
            <div class="card-body">
                <form onsubmit="addProduct(event)">
                    <div class="mb-3">
                        <label class="form-label">Nombre:</label>
                        <input type="text" class="form-control" id="productName" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Precio:</label>
                        <input type="number" class="form-control" id="productPrice" step="0.01" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Categoría:</label>
                        <select class="form-control" id="productCategory" required>
                            <option value="Hamburguesas">Hamburguesas</option>
                            <option value="Pizzas">Pizzas</option>
                            <option value="Bebidas">Bebidas</option>
                            <option value="Postres">Postres</option>
                            <option value="Acompañamientos">Acompañamientos</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Emoji:</label>
                        <input type="text" class="form-control" id="productImage" placeholder="🍔" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Agregar</button>
                    <button type="button" class="btn btn-secondary" onclick="hideAddProduct()">Cancelar</button>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('addProductDiv').innerHTML = html;
}

async function addProduct(event) {
    event.preventDefault();
    
    const product = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        image: document.getElementById('productImage').value
    };
    
    try {
        await fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(product)
        });
        
        alert('Producto agregado exitosamente');
        hideAddProduct();
    } catch (error) {
        alert('Error al agregar producto');
    }
}

function hideAddProduct() {
    document.getElementById('addProductDiv').innerHTML = '';
}

function logout() {
    localStorage.removeItem('session');
    window.location.href = 'index.html';
}

loadDashboard();