let currentUser = null;
let products = [];
let cart = [];
let currentCategory = 'Todos';

const session = localStorage.getItem('session');
if (!session) {
    window.location.href = 'index.html';
} else {
    currentUser = JSON.parse(session);
    if (currentUser.role !== 'user') {
        window.location.href = 'index.html';
    }
    document.getElementById('userName').textContent = currentUser.name;
}

async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        products = await response.json();
        showProducts();
    } catch (error) {
        alert('Error al cargar productos. Verifica que JSON Server esté ejecutándose.');
    }
}

function showProducts() {
    let productsToShow = products;
    
    if (currentCategory !== 'Todos') {
        productsToShow = products.filter(p => p.category === currentCategory);
    }
    
    let html = '';
    productsToShow.forEach(product => {
        html += `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-2 text-center">
                            <span style="font-size: 2rem;">${product.image}</span>
                        </div>
                        <div class="col-6">
                            <h5 class="mb-1">${product.name}</h5>
                            <small class="text-muted">${product.category}</small>
                        </div>
                        <div class="col-2">
                            <strong class="text-success">$${product.price}</strong>
                        </div>
                        <div class="col-2">
                            <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    document.getElementById('productsDiv').innerHTML = html;
}

function filterProducts(category) {
    currentCategory = category;
    
    document.querySelectorAll('.btn-group .btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === category) {
            btn.classList.add('active');
        }
    });
    
    showProducts();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const item = cart.find(c => c.id === productId);
    
    if (item) {
        item.qty++;
    } else {
        cart.push({id: productId, name: product.name, price: product.price, qty: 1});
    }
    showCart();
}

function showCart() {
    if (cart.length === 0) {
        document.getElementById('cartDiv').innerHTML = 'Tu carrito está vacío';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        html += `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <small>${item.name}</small><br>
                    <span class="text-muted">$${item.price} x ${item.qty}</span>
                </div>
                <div>
                    <span class="me-2">$${subtotal.toFixed(2)}</span>
                    <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${item.id})">
                        ×
                    </button>
                </div>
            </div>
        `;
    });
    
    html += `<hr><div class="text-end"><strong>Total: $${total.toFixed(2)}</strong></div>`;
    document.getElementById('cartDiv').innerHTML = html;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    showCart();
}

async function createOrder() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    const order = {
        userId: currentUser.id,
        userName: currentUser.name,
        items: cart,
        total: total,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
    };
    
    try {
        await fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(order)
        });
        
        alert('¡Pedido creado exitosamente!');
        cart = [];
        showCart();
    } catch (error) {
        alert('Error al crear el pedido');
    }
}

async function showMyOrders() {
    try {
        const response = await fetch('http://localhost:3000/orders');
        const orders = await response.json();
        const myOrders = orders.filter(o => o.userId === currentUser.id);
        
        let html = '';
        if (myOrders.length === 0) {
            html = '<p class="text-muted">No tienes pedidos aún.</p>';
        } else {
            myOrders.forEach(order => {
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
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h6>Pedido #${order.id}</h6>
                                    <p class="mb-1">Total: $${order.total}</p>
                                    <small class="text-muted">Fecha: ${order.date}</small>
                                </div>
                                <div>
                                    ${statusBadge}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        document.getElementById('ordersList').innerHTML = html;
        document.getElementById('ordersDiv').style.display = 'block';
        document.querySelector('.row').style.display = 'none';
    } catch (error) {
        alert('Error al cargar pedidos');
    }
}

function showMenu() {
    document.getElementById('ordersDiv').style.display = 'none';
    document.querySelector('.row').style.display = 'flex';
}

function logout() {
    localStorage.removeItem('session');
    window.location.href = 'index.html';
}

loadProducts();