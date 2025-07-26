# Ejemplos de Uso con Postman

## Configuración Base
- **Base URL**: `http://localhost:8080`
- **Content-Type**: `application/json`

## Endpoints de Productos

### 1. Obtener todos los productos
- **Método**: GET
- **URL**: `{{base_url}}/api/products`

### 2. Obtener producto por ID
- **Método**: GET
- **URL**: `{{base_url}}/api/products/1`

### 3. Crear nuevo producto
- **Método**: POST
- **URL**: `{{base_url}}/api/products`
- **Headers**: 
  - Content-Type: application/json
- **Body** (raw JSON):
```json
{
  "title": "Smartphone Samsung",
  "description": "Smartphone de última generación",
  "code": "SMS001",
  "price": 800,
  "stock": 15,
  "category": "Electrónicos",
  "thumbnails": ["samsung1.jpg", "samsung2.jpg"]
}
```

### 4. Actualizar producto
- **Método**: PUT
- **URL**: `{{base_url}}/api/products/1`
- **Headers**: 
  - Content-Type: application/json
- **Body** (raw JSON):
```json
{
  "price": 750,
  "stock": 20
}
```

### 5. Eliminar producto
- **Método**: DELETE
- **URL**: `{{base_url}}/api/products/1`

## Endpoints de Carritos

### 1. Crear nuevo carrito
- **Método**: POST
- **URL**: `{{base_url}}/api/carts`

### 2. Obtener carrito por ID
- **Método**: GET
- **URL**: `{{base_url}}/api/carts/1`

### 3. Agregar producto al carrito
- **Método**: POST
- **URL**: `{{base_url}}/api/carts/1/product/1`
- **Headers**: 
  - Content-Type: application/json
- **Body** (raw JSON):
```json
{
  "quantity": 3
}
```

### 4. Actualizar cantidad de producto en carrito
- **Método**: PUT
- **URL**: `{{base_url}}/api/carts/1/product/1`
- **Headers**: 
  - Content-Type: application/json
- **Body** (raw JSON):
```json
{
  "quantity": 5
}
```

### 5. Eliminar producto del carrito
- **Método**: DELETE
- **URL**: `{{base_url}}/api/carts/1/product/1`

### 6. Vaciar carrito
- **Método**: DELETE
- **URL**: `{{base_url}}/api/carts/1`

## Flujo de Prueba Completo

### Paso 1: Crear productos
1. Crear producto 1 (Laptop)
2. Crear producto 2 (Smartphone)

### Paso 2: Crear carrito
1. Crear carrito vacío

### Paso 3: Agregar productos al carrito
1. Agregar producto 1 al carrito
2. Agregar producto 2 al carrito
3. Verificar carrito con productos

### Paso 4: Modificar carrito
1. Actualizar cantidad de producto 1
2. Eliminar producto 2 del carrito
3. Verificar cambios

### Paso 5: Limpiar
1. Vaciar carrito
2. Eliminar productos

## Variables de Entorno en Postman

Puedes configurar variables en Postman:

1. **base_url**: `http://localhost:8080`
2. **product_id**: ID del producto creado
3. **cart_id**: ID del carrito creado

## Respuestas Esperadas

### Producto creado exitosamente:
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Laptop Gaming",
    "description": "Laptop para gaming de alto rendimiento",
    "code": "LAP001",
    "price": 1500,
    "status": true,
    "stock": 10,
    "category": "Electrónicos",
    "thumbnails": ["laptop1.jpg", "laptop2.jpg"]
  }
}
```

### Carrito con productos:
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
          "title": "Laptop Gaming",
          "description": "Laptop para gaming de alto rendimiento",
          "code": "LAP001",
          "price": 1500,
          "status": true,
          "stock": 10,
          "category": "Electrónicos",
          "thumbnails": ["laptop1.jpg", "laptop2.jpg"]
        }
      }
    ]
  }
}
```

### Error de validación:
```json
{
  "status": "error",
  "message": "El campo title es requerido"
}
``` 