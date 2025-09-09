# API de Gestión de Productos y Carritos - Entrega Final

Este proyecto implementa un servidor REST API para gestionar productos y carritos de compra utilizando Node.js, Express, MongoDB, Socket.io y Handlebars.

## 🚀 Características

- **Gestión de Productos**: CRUD completo con paginación, filtros y ordenamiento
- **Gestión de Carritos**: Creación y gestión completa de carritos de compra
- **Persistencia**: MongoDB como base de datos principal
- **WebSockets**: Actualización en tiempo real con Socket.io
- **Vistas**: Interfaz web con Handlebars
- **Validaciones**: Validación de datos y manejo de errores
- **REST API**: Endpoints RESTful bien estructurados

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd comision-77525
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura MongoDB:
   - Instala MongoDB localmente o usa MongoDB Atlas
   - La aplicación se conecta por defecto a `mongodb://localhost:27017/comision77525`

4. Migra los datos existentes (opcional):
```bash
npm run migrate
```

5. Inicia el servidor:
```bash
npm start
```

Para desarrollo con recarga automática:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:8080`

## 🏗️ Estructura del Proyecto

```
comision-77525/
├── server.js              # Archivo principal del servidor
├── package.json           # Configuración del proyecto
├── README.md             # Documentación
├── config/
│   └── database.js        # Configuración de MongoDB
├── models/
│   ├── Product.js         # Modelo de Producto
│   └── Cart.js           # Modelo de Carrito
├── routes/
│   ├── products.js        # Rutas de productos
│   ├── carts.js          # Rutas de carritos
│   └── views.js          # Rutas de vistas
├── views/
│   ├── layouts/
│   │   └── main.handlebars # Layout principal
│   ├── home.handlebars    # Vista home
│   ├── products.handlebars # Vista de productos
│   ├── product-detail.handlebars # Vista de producto individual
│   ├── cart.handlebars    # Vista de carrito
│   ├── realtimeproducts.handlebars # Vista tiempo real
│   └── error.handlebars   # Vista de error
├── scripts/
│   └── migrate-data.js    # Script de migración
└── data/                 # Archivos JSON (legacy)
    ├── products.json
    └── carts.json
```

## 🔗 Endpoints de la API

### Productos (`/api/products`)

#### GET `/api/products`
Obtiene productos con paginación, filtros y ordenamiento.

**Query Parameters:**
- `limit` (opcional): Número de elementos por página (default: 10)
- `page` (opcional): Número de página (default: 1)
- `sort` (opcional): Ordenamiento por precio (`asc`/`desc`)
- `query` (opcional): Filtro por categoría o disponibilidad

**Ejemplos:**
```
GET /api/products?limit=5&page=1&sort=asc&query=available
GET /api/products?query=Electrónicos&sort=desc
```

**Respuesta:**
```json
{
  "status": "success",
  "payload": [...],
  "totalPages": 3,
  "prevPage": null,
  "nextPage": 2,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevLink": null,
  "nextLink": "http://localhost:8080/api/products?page=2&limit=10"
}
```

#### GET `/api/products/:pid`
Obtiene un producto específico por ID.

#### POST `/api/products`
Crea un nuevo producto.

#### PUT `/api/products/:pid`
Actualiza un producto existente.

#### DELETE `/api/products/:pid`
Elimina un producto.

### Carritos (`/api/carts`)

#### POST `/api/carts`
Crea un nuevo carrito vacío.

#### GET `/api/carts/:cid`
Obtiene un carrito específico con productos completos (populate).

#### POST `/api/carts/:cid/product/:pid`
Agrega un producto al carrito.

#### PUT `/api/carts/:cid/products/:pid`
Actualiza la cantidad de un producto en el carrito.

#### DELETE `/api/carts/:cid/products/:pid`
Elimina un producto del carrito.

#### PUT `/api/carts/:cid`
Actualiza todos los productos del carrito.

#### DELETE `/api/carts/:cid`
Vacía completamente el carrito.

## 🎨 Vistas Web

### Rutas de Vistas

- **`/`** - Home con lista de productos
- **`/products`** - Lista de productos con paginación y filtros
- **`/products/:pid`** - Detalle de producto individual
- **`/carts/:cid`** - Vista de carrito específico
- **`/realtimeproducts`** - Productos en tiempo real con WebSockets

### Características de las Vistas

- **Paginación**: Navegación entre páginas
- **Filtros**: Por categoría y disponibilidad
- **Ordenamiento**: Por precio ascendente/descendente
- **WebSockets**: Actualización en tiempo real
- **Responsive**: Diseño adaptable a móviles

## 🔧 Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript
- **Express**: Framework web para Node.js
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **Socket.io**: WebSockets para tiempo real
- **Handlebars**: Motor de plantillas
- **Async/Await**: Manejo asíncrono de operaciones

## 📊 Modelos de Datos

### Producto
```javascript
{
  title: String (requerido),
  description: String (requerido),
  code: String (requerido, único),
  price: Number (requerido, mínimo 0),
  status: Boolean (default: true),
  stock: Number (requerido, mínimo 0),
  category: String (requerido),
  thumbnails: [String] (default: []),
  timestamps: true
}
```

### Carrito
```javascript
{
  products: [{
    product: ObjectId (referencia a Product),
    quantity: Number (requerido, mínimo 1)
  }],
  timestamps: true
}
```

## 🚀 Funcionalidades Implementadas

### ✅ Entrega N° 1
- API REST completa
- Persistencia en archivos JSON
- CRUD de productos y carritos
- Documentación completa

### ✅ Entrega N° 2
- WebSockets con Socket.io
- Handlebars como motor de plantillas
- Vistas home y realTimeProducts
- Actualización en tiempo real

### ✅ Entrega Final
- MongoDB como persistencia principal
- Paginación, filtros y ordenamiento
- Endpoints profesionales de carritos
- Vistas completas con navegación
- Referencias entre modelos (populate)

## 🎯 Criterios de Evaluación Cumplidos

- ✅ **MongoDB**: Sistema de persistencia principal
- ✅ **Endpoints profesionales**: Paginación, filtros, ordenamiento
- ✅ **Gestión de carritos**: Endpoints completos con populate
- ✅ **Vistas**: Navegación completa con paginación
- ✅ **Detalle de producto**: Vista individual con agregar al carrito
- ✅ **Vista de carrito**: Lista específica de productos
- ✅ **Estructura**: Misma lógica, nueva persistencia

## 📝 Notas de Desarrollo

- La lógica de negocio se mantiene igual, solo cambió la persistencia
- Los endpoints siguen la misma estructura y convenciones
- Se implementó populate para traer productos completos en carritos
- Las vistas son responsive y modernas
- WebSockets funcionan con MongoDB

## 👨‍💻 Autor

Desarrollado para la Comisión 77525 - Entrega Final
