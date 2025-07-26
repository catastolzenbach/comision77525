# Documentación de la API - Comisión 77525

## Descripción General

Esta API permite gestionar productos y carritos de compra mediante endpoints REST. La persistencia de datos se realiza mediante archivos JSON.

## Base URL
```
http://localhost:8080
```

## Endpoints de Productos

### GET /api/products
**Descripción:** Lista todos los productos de la base de datos.

**Respuesta:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "Laptop Gaming",
      "description": "Laptop para gaming de alto rendimiento",
      "code": "LAP001",
      "price": 899990,
      "status": true,
      "stock": 10,
      "category": "Electrónicos",
      "thumbnails": ["laptop1.jpg", "laptop2.jpg"]
    }
  ]
}
```

### GET /api/products/:pid
**Descripción:** Obtiene un producto específico por ID.

**Parámetros:**
- `pid`: ID del producto (número)

**Respuesta:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Laptop Gaming",
    "description": "Laptop para gaming de alto rendimiento",
    "code": "LAP001",
    "price": 899990,
    "status": true,
    "stock": 10,
    "category": "Electrónicos",
    "thumbnails": ["laptop1.jpg", "laptop2.jpg"]
  }
}
```

### POST /api/products
**Descripción:** Crea un nuevo producto.

**Campos requeridos:**
- `title`: String
- `description`: String
- `code`: String (único)
- `price`: Number
- `stock`: Number
- `category`: String

**Campos opcionales:**
- `status`: Boolean (default: true)
- `thumbnails`: Array de Strings (default: [])

**Body:**
```json
{
  "title": "Nuevo Producto",
  "description": "Descripción del producto",
  "code": "PROD001",
  "price": 50000,
  "stock": 20,
  "category": "Electrónicos",
  "status": true,
  "thumbnails": ["imagen1.jpg", "imagen2.jpg"]
}
```

**Respuesta:**
```json
{
  "status": "success",
  "data": {
    "id": 14,
    "title": "Nuevo Producto",
    "description": "Descripción del producto",
    "code": "PROD001",
    "price": 50000,
    "status": true,
    "stock": 20,
    "category": "Electrónicos",
    "thumbnails": ["imagen1.jpg", "imagen2.jpg"]
  }
}
```

### PUT /api/products/:pid
**Descripción:** Actualiza un producto existente.

**Parámetros:**
- `pid`: ID del producto (número)

**Body:** Campos a actualizar (todos opcionales excepto el ID que no se puede modificar)

```json
{
  "price": 45000,
  "stock": 25
}
```

### DELETE /api/products/:pid
**Descripción:** Elimina un producto.

**Parámetros:**
- `pid`: ID del producto (número)

## Endpoints de Carritos

### POST /api/carts
**Descripción:** Crea un nuevo carrito vacío.

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

### GET /api/carts/:cid
**Descripción:** Lista los productos que pertenecen al carrito.

**Parámetros:**
- `cid`: ID del carrito (número)

**Respuesta:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "products": [
      {
        "product": 1,
        "quantity": 2
      },
      {
        "product": 3,
        "quantity": 1
      }
    ]
  }
}
```

### POST /api/carts/:cid/product/:pid
**Descripción:** Agrega un producto al carrito.

**Parámetros:**
- `cid`: ID del carrito (número)
- `pid`: ID del producto (número)

**Body (opcional):**
```json
{
  "quantity": 1
}
```

**Nota:** Si el producto ya existe en el carrito, se incrementa la cantidad.

## Estructura de Datos

### Producto
```json
{
  "id": "Number (autogenerado)",
  "title": "String",
  "description": "String",
  "code": "String (único)",
  "price": "Number",
  "status": "Boolean",
  "stock": "Number",
  "category": "String",
  "thumbnails": ["Array de Strings"]
}
```

### Carrito
```json
{
  "id": "Number (autogenerado)",
  "products": [
    {
      "product": "ID del producto",
      "quantity": "número de ejemplares"
    }
  ]
}
```

## Códigos de Estado HTTP

- `200`: Operación exitosa
- `201`: Recurso creado exitosamente
- `400`: Error en los datos enviados
- `404`: Recurso no encontrado
- `500`: Error interno del servidor

## Manejo de Errores

Todas las respuestas de error siguen este formato:

```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

## Persistencia

Los datos se almacenan en:
- `data/products.json`: Productos
- `data/carts.json`: Carritos

Los archivos se crean automáticamente al iniciar el servidor.

## Instalación y Uso

1. Clonar el repositorio
2. Ejecutar `npm install`
3. Ejecutar `npm start`
4. El servidor estará disponible en `http://localhost:8080`

## Testing

Puedes probar la API usando:
- Postman
- cURL
- La interfaz web en `http://localhost:8080`
- Cualquier cliente HTTP

## Ejemplos de Uso con cURL

### Crear un producto
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Producto de Prueba",
    "description": "Descripción de prueba",
    "code": "TEST001",
    "price": 10000,
    "stock": 5,
    "category": "Pruebas"
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