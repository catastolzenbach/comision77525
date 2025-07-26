# API de Gestión de Productos y Carritos

Este proyecto implementa un servidor REST API para gestionar productos y carritos de compra utilizando Node.js y Express.

## Características

- **Gestión de Productos**: CRUD completo para productos
- **Gestión de Carritos**: Creación y gestión de carritos de compra
- **Persistencia**: Almacenamiento en archivos JSON
- **Validaciones**: Validación de datos y manejo de errores
- **REST API**: Endpoints RESTful bien estructurados

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd comision-77525
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor:
```bash
npm start
```

Para desarrollo con recarga automática:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:8080`

## Estructura del Proyecto

```
comision-77525/
├── server.js              # Archivo principal del servidor
├── package.json           # Configuración del proyecto
├── README.md             # Documentación
├── managers/
│   ├── ProductManager.js  # Gestión de productos
│   └── CartManager.js     # Gestión de carritos
├── routes/
│   ├── products.js        # Rutas de productos
│   └── carts.js          # Rutas de carritos
└── data/                 # Archivos de persistencia (se crean automáticamente)
    ├── products.json
    └── carts.json
```

## Endpoints de la API

### Productos (`/api/products`)

#### GET `/api/products`
Obtiene todos los productos.

**Respuesta:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "Producto Ejemplo",
      "description": "Descripción del producto",
      "code": "PROD001",
      "price": 100,
      "status": true,
      "stock": 50,
      "category": "Electrónicos",
      "thumbnails": ["imagen1.jpg", "imagen2.jpg"]
    }
  ]
}
```

#### GET `/api/products/:pid`
Obtiene un producto específico por ID.

**Parámetros:**
- `pid`: ID del producto

#### POST `/api/products`
Crea un nuevo producto.

**Body:**
```json
{
  "title": "Nuevo Producto",
  "description": "Descripción del nuevo producto",
  "code": "PROD002",
  "price": 150,
  "status": true,
  "stock": 25,
  "category": "Ropa",
  "thumbnails": ["nueva-imagen.jpg"]
}
```

**Campos requeridos:** `title`, `description`, `code`, `price`, `stock`, `category`
**Campos opcionales:** `status` (default: true), `thumbnails` (default: [])

#### PUT `/api/products/:pid`
Actualiza un producto existente.

**Parámetros:**
- `pid`: ID del producto

**Body:** Campos a actualizar (todos opcionales excepto el ID que no se puede modificar)

#### DELETE `/api/products/:pid`
Elimina un producto.

**Parámetros:**
- `pid`: ID del producto

### Carritos (`/api/carts`)

#### POST `/api/carts`
Crea un nuevo carrito vacío.

**Respuesta:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "products": []
  }
}
```

#### GET `/api/carts/:cid`
Obtiene un carrito específico con detalles de productos.

**Parámetros:**
- `cid`: ID del carrito

**Respuesta:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "products": [
      {
        "product": 1,
        "quantity": 2,
        "productDetails": {
          "id": 1,
          "title": "Producto Ejemplo",
          "description": "Descripción del producto",
          "price": 100,
          "status": true
        }
      }
    ]
  }
}
```

#### POST `/api/carts/:cid/product/:pid`
Agrega un producto al carrito.

**Parámetros:**
- `cid`: ID del carrito
- `pid`: ID del producto

**Body (opcional):**
```json
{
  "quantity": 1
}
```

Si el producto ya existe en el carrito, se incrementa la cantidad.

#### PUT `/api/carts/:cid/product/:pid`
Actualiza la cantidad de un producto en el carrito.

**Parámetros:**
- `cid`: ID del carrito
- `pid`: ID del producto

**Body:**
```json
{
  "quantity": 3
}
```

#### DELETE `/api/carts/:cid/product/:pid`
Elimina un producto del carrito.

**Parámetros:**
- `cid`: ID del carrito
- `pid`: ID del producto

#### DELETE `/api/carts/:cid`
Vacía completamente el carrito.

**Parámetros:**
- `cid`: ID del carrito

## Manejo de Errores

La API devuelve respuestas de error consistentes:

```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

**Códigos de estado HTTP:**
- `200`: Operación exitosa
- `201`: Recurso creado exitosamente
- `400`: Error en los datos enviados
- `404`: Recurso no encontrado
- `500`: Error interno del servidor

## Persistencia de Datos

Los datos se almacenan en archivos JSON:
- `data/products.json`: Almacena todos los productos
- `data/carts.json`: Almacena todos los carritos

Los archivos se crean automáticamente cuando se ejecuta el servidor por primera vez.

## Ejemplos de Uso

### Crear un producto
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Laptop Gaming",
    "description": "Laptop para gaming de alto rendimiento",
    "code": "LAP001",
    "price": 1500,
    "stock": 10,
    "category": "Electrónicos",
    "thumbnails": ["laptop1.jpg", "laptop2.jpg"]
  }'
```

### Crear un carrito
```bash
curl -X POST http://localhost:8080/api/carts
```

### Agregar producto al carrito
```bash
curl -X POST http://localhost:8080/api/carts/1/product/1 \
  -H "Content-Type: application/json" \
  -d '{"quantity": 2}'
```

### Obtener carrito con productos
```bash
curl http://localhost:8080/api/carts/1
```

## Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript
- **Express**: Framework web para Node.js
- **File System**: Persistencia de datos en archivos JSON
- **Async/Await**: Manejo asíncrono de operaciones

## Autor

Desarrollado para la Comisión 77525 