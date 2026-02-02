# 🍽️ RestorApp - Sistema de Gestión de Pedidos

## 📋 Descripción
Sistema web de gestión de pedidos para restaurante desarrollado con **HTML5, CSS3, Bootstrap 5 y JavaScript Vanilla**. Utiliza **JSON Server** como API REST falsa para persistencia de datos.

## ✨ Funcionalidades

### 👥 Autenticación
- Registro de usuarios (automáticamente con role "user")
- Login con email/password y selección de role
- Sesiones persistentes con localStorage
- Roles: `user` y `admin`

### 🍔 Para Usuarios (Clientes)
- Visualización del menú de productos
- Filtrado por categorías (All, Burgers, Sides, Drinks, Desserts, Pizza)
- Carrito de compras con localStorage
- Creación de pedidos
- Visualización de historial de pedidos propios
- Cancelación de pedidos pendientes

### 👨‍💼 Para Administradores
- Dashboard con métricas del negocio
- Gestión completa de productos (CRUD)
- Gestión de pedidos de todos los usuarios
- Actualización de estados de pedidos (pending → preparing → delivered)
- Visualización de estadísticas en tiempo real

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js instalado
- Navegador web moderno

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
```bash
git clone https://github.com/Jaramc/Simulacro-prueba-de-desempe-o.git
cd Simulacro-prueba-de-desempe-o
```

2. **Instalar JSON Server globalmente**
```bash
npm install -g json-server
```

3. **Ejecutar JSON Server**
```bash
json-server --watch db.json --port 3000
```

4. **Abrir la aplicación**
   - Abrir `index.html` en el navegador
   - O usar un servidor local como Live Server en VS Code

## 📁 Estructura del Proyecto

```
├── index.html          # Página de login
├── register.html       # Página de registro
├── user.html          # Menú para usuarios
├── admin.html         # Dashboard administrativo
├── my-orders.html     # Historial de pedidos del usuario
├── styles.css         # Estilos personalizados
├── login.js           # Lógica de autenticación
├── register.js        # Lógica de registro
├── user.js           # Funcionalidad del menú de usuario
├── admin.js          # Funcionalidad administrativa
├── my-orders.js      # Gestión de pedidos del usuario
├── db.json           # Base de datos JSON Server
├── images/           # Imágenes de productos
└── README.md         # Documentación
```

## 🔑 Credenciales por Defecto

### Administrador
- **Email:** admin@resto.com
- **Password:** admin123
- **Role:** admin

### Usuario de Prueba
- Crear cuenta nueva con role "user"

## 🌐 Endpoints de la API

### Usuarios
- `GET /users` - Obtener todos los usuarios
- `POST /users` - Crear nuevo usuario

### Productos
- `GET /products` - Obtener todos los productos
- `POST /products` - Crear nuevo producto
- `PUT /products/:id` - Actualizar producto
- `PATCH /products/:id` - Actualización parcial
- `DELETE /products/:id` - Eliminar producto

### Pedidos
- `GET /orders` - Obtener todos los pedidos
- `POST /orders` - Crear nuevo pedido
- `PATCH /orders/:id` - Actualizar estado del pedido

## 🎯 Características Técnicas

- **Frontend:** HTML5, CSS3, Bootstrap 5, JavaScript Vanilla
- **Backend:** JSON Server (API REST falsa)
- **Base de Datos:** Archivo JSON local
- **Autenticación:** Basada en sesiones con localStorage
- **Responsive:** Totalmente adaptable a dispositivos móviles
- **Sin Frameworks:** Código vanilla para máximo aprendizaje

## 🔧 Desarrollo

### Estados de Pedidos
- `pending` - Pedido recibido
- `preparing` - En preparación
- `delivered` - Entregado
- `cancelled` - Cancelado

### Validaciones Implementadas
- Email único en registro
- Campos requeridos
- Formato de email válido
- Contraseñas mínimo 4 caracteres
- Roles válidos (user/admin)

## 🐛 Solución de Problemas

### JSON Server no funciona
1. Verificar que Node.js esté instalado: `node --version`
2. Reinstalar JSON Server: `npm install -g json-server`
3. Verificar puerto 3000 disponible

### Error de CORS
- JSON Server maneja CORS automáticamente
- Verificar que la URL base sea `http://localhost:3000`

### Productos no cargan
1. Verificar que JSON Server esté ejecutándose
2. Comprobar archivo `db.json` existe
3. Revisar consola del navegador para errores

## 🏆 Cumplimiento de Requisitos

✅ HTML5, CSS3, JavaScript Vanilla  
✅ Bootstrap 5 CDN  
✅ JSON Server como API  
✅ Fetch API para comunicación  
✅ Autenticación con roles  
✅ CRUD de productos  
✅ Gestión de pedidos  
✅ Carrito de compras  
✅ Dashboard administrativo  
✅ Responsive design  
✅ Sin frameworks adicionales  

## 👨‍💻 Autor
Proyecto desarrollado como simulacro de prueba de desempeño.

---
**🚀 ¡Proyecto listo para usar! Ejecuta JSON Server y comienza a probar todas las funcionalidades.**
