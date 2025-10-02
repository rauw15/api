# API REST para Aplicación Móvil Flutter

Una API REST completa desarrollada en Node.js con Express para ser consumida por una aplicación móvil Flutter. Incluye operaciones CRUD completas, filtros, paginación, validaciones y documentación automática.

## 🚀 Características

- **Arquitectura modular** con separación clara de responsabilidades
- **Operaciones CRUD completas** para productos
- **Filtros y paginación** avanzados
- **Validaciones robustas** con express-validator
- **Documentación automática** con Swagger
- **Manejo de errores centralizado**
- **CORS configurado** para Flutter
- **Rate limiting** para seguridad
- **Almacenamiento JSON** local con datos de ejemplo
- **Respuestas estandarizadas** en formato JSON

## 📁 Estructura del Proyecto

```
Backend/
├── src/
│   ├── controllers/
│   │   └── productController.js    # Controladores para productos
│   ├── middleware/
│   │   ├── errorHandler.js         # Manejo centralizado de errores
│   │   └── validation.js           # Validaciones con express-validator
│   ├── models/
│   │   └── Product.js              # Modelo y repositorio de productos
│   ├── routes/
│   │   └── productRoutes.js        # Rutas de la API
│   └── server.js                   # Servidor principal
├── data/
│   └── products.json               # Almacenamiento JSON (se crea automáticamente)
├── package.json
└── README.md
```

## 🛠️ Instalación

1. **Instalar dependencias:**
   ```bash
   cd Backend
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

3. **Ejecutar en producción:**
   ```bash
   npm start
   ```

## 🌐 Endpoints de la API

### Base URL
```
http://localhost:3000
```

### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Obtener lista de productos |
| GET | `/api/products/:id` | Obtener producto por ID |
| POST | `/api/products` | Crear nuevo producto |
| PUT | `/api/products/:id` | Actualizar producto |
| DELETE | `/api/products/:id` | Eliminar producto |
| GET | `/api/products/categories` | Obtener categorías |
| GET | `/health` | Estado del servidor |
| GET | `/api-docs` | Documentación Swagger |

## 📝 Ejemplos de Uso

### 1. Obtener todos los productos
```bash
GET /api/products
```

**Respuesta:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid-here",
      "name": "Smartphone Samsung Galaxy S23",
      "description": "Teléfono inteligente con pantalla AMOLED",
      "price": 899.99,
      "category": "Electrónicos",
      "stock": 15,
      "imageUrl": "https://example.com/image.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "isActive": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 5,
    "itemsPerPage": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### 2. Crear un nuevo producto
```bash
POST /api/products
Content-Type: application/json

{
  "name": "Nuevo Producto",
  "description": "Descripción del producto",
  "price": 299.99,
  "category": "Electrónicos",
  "stock": 10,
  "imageUrl": "https://example.com/image.jpg"
}
```

### 3. Filtrar productos
```bash
GET /api/products?category=Electrónicos&minPrice=100&maxPrice=500&search=smartphone&page=1&limit=5
```

### 4. Actualizar producto
```bash
PUT /api/products/{id}
Content-Type: application/json

{
  "name": "Producto Actualizado",
  "price": 399.99,
  "stock": 20
}
```

## 🔍 Filtros y Paginación

### Parámetros de Consulta

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `page` | integer | Número de página (mín: 1) | `?page=2` |
| `limit` | integer | Elementos por página (1-100) | `?limit=10` |
| `category` | string | Filtrar por categoría | `?category=Electrónicos` |
| `minPrice` | number | Precio mínimo | `?minPrice=100` |
| `maxPrice` | number | Precio máximo | `?maxPrice=500` |
| `search` | string | Búsqueda por texto | `?search=smartphone` |
| `sortBy` | string | Campo para ordenar | `?sortBy=price` |
| `sortOrder` | string | Orden (asc/desc) | `?sortOrder=desc` |

### Campos de Ordenamiento Disponibles
- `name` - Nombre del producto
- `price` - Precio
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de actualización

## 📚 Documentación Swagger

La documentación interactiva está disponible en:
```
http://localhost:3000/api-docs
```

## 🔒 Seguridad

- **Helmet** para headers de seguridad
- **CORS** configurado para Flutter
- **Rate Limiting** (100 requests por 15 minutos)
- **Validaciones** robustas en todos los endpoints
- **Sanitización** de datos de entrada

## 🎯 Formato de Respuestas

### Respuesta Exitosa
```json
{
  "status": "success",
  "data": { ... }
}
```

### Respuesta con Paginación
```json
{
  "status": "success",
  "data": [ ... ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Respuesta de Error
```json
{
  "status": "error",
  "message": "Descripción del error",
  "details": { ... }
}
```

## 🧪 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Solicitud inválida |
| 404 | Not Found - Recurso no encontrado |
| 422 | Unprocessable Entity - Datos inválidos |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Error del servidor |

## 🔧 Configuración para Flutter

### CORS
La API está configurada para aceptar peticiones desde:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

### Headers Requeridos
```dart
headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}
```

### Ejemplo de Petición en Flutter
```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<List<Product>> getProducts() async {
  final response = await http.get(
    Uri.parse('http://localhost:3000/api/products'),
    headers: {'Content-Type': 'application/json'},
  );
  
  if (response.statusCode == 200) {
    final data = json.decode(response.body);
    return (data['data'] as List)
        .map((json) => Product.fromJson(json))
        .toList();
  } else {
    throw Exception('Error al cargar productos');
  }
}
```

## 🚀 Despliegue

### Variables de Entorno
```bash
PORT=3000
NODE_ENV=production
```

### Docker (Opcional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Monitoreo

### Health Check
```bash
GET /health
```

**Respuesta:**
```json
{
  "status": "success",
  "message": "API funcionando correctamente",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

## 🛠️ Desarrollo

### Scripts Disponibles
```bash
npm start          # Ejecutar en producción
npm run dev        # Ejecutar en desarrollo con nodemon
npm test           # Ejecutar pruebas
```

### Estructura de Datos

#### Producto
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "stock": "integer",
  "imageUrl": "string",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601",
  "isActive": "boolean"
}
```

## 📞 Soporte

Para reportar problemas o solicitar nuevas funcionalidades, crea un issue en el repositorio del proyecto.

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

