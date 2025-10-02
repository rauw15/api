# Integración con Flutter

Esta guía te ayudará a integrar la API REST con tu aplicación Flutter.

## 📱 Configuración en Flutter

### 1. Dependencias necesarias

Agrega estas dependencias a tu `pubspec.yaml`:

```yaml
dependencies:
  http: ^1.1.0
  dio: ^5.3.2  # Alternativa más robusta a http
  json_annotation: ^4.8.1

dev_dependencies:
  json_serializable: ^6.7.1
  build_runner: ^2.4.7
```

### 2. Modelo de Producto en Flutter

```dart
// lib/models/product.dart
import 'package:json_annotation/json_annotation.dart';

part 'product.g.dart';

@JsonSerializable()
class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final String category;
  final int stock;
  final String imageUrl;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isActive;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.category,
    required this.stock,
    required this.imageUrl,
    required this.createdAt,
    required this.updatedAt,
    required this.isActive,
  });

  factory Product.fromJson(Map<String, dynamic> json) => _$ProductFromJson(json);
  Map<String, dynamic> toJson() => _$ProductToJson(this);
}
```

### 3. Servicio de API

```dart
// lib/services/api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/product.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:3000/api';
  
  // Headers por defecto
  static Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // GET /api/products
  static Future<List<Product>> getProducts({
    int page = 1,
    int limit = 10,
    String? category,
    double? minPrice,
    double? maxPrice,
    String? search,
    String? sortBy,
    String? sortOrder,
  }) async {
    final queryParams = <String, String>{
      'page': page.toString(),
      'limit': limit.toString(),
    };

    if (category != null) queryParams['category'] = category;
    if (minPrice != null) queryParams['minPrice'] = minPrice.toString();
    if (maxPrice != null) queryParams['maxPrice'] = maxPrice.toString();
    if (search != null) queryParams['search'] = search;
    if (sortBy != null) queryParams['sortBy'] = sortBy;
    if (sortOrder != null) queryParams['sortOrder'] = sortOrder;

    final uri = Uri.parse('$baseUrl/products').replace(
      queryParameters: queryParams,
    );

    final response = await http.get(uri, headers: _headers);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final products = (data['data'] as List)
          .map((json) => Product.fromJson(json))
          .toList();
      return products;
    } else {
      throw Exception('Error al cargar productos: ${response.statusCode}');
    }
  }

  // GET /api/products/:id
  static Future<Product> getProductById(String id) async {
    final response = await http.get(
      Uri.parse('$baseUrl/products/$id'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return Product.fromJson(data['data']);
    } else if (response.statusCode == 404) {
      throw Exception('Producto no encontrado');
    } else {
      throw Exception('Error al cargar producto: ${response.statusCode}');
    }
  }

  // POST /api/products
  static Future<Product> createProduct(Product product) async {
    final response = await http.post(
      Uri.parse('$baseUrl/products'),
      headers: _headers,
      body: json.encode(product.toJson()),
    );

    if (response.statusCode == 201) {
      final data = json.decode(response.body);
      return Product.fromJson(data['data']);
    } else {
      final error = json.decode(response.body);
      throw Exception('Error al crear producto: ${error['message']}');
    }
  }

  // PUT /api/products/:id
  static Future<Product> updateProduct(String id, Map<String, dynamic> updates) async {
    final response = await http.put(
      Uri.parse('$baseUrl/products/$id'),
      headers: _headers,
      body: json.encode(updates),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return Product.fromJson(data['data']);
    } else if (response.statusCode == 404) {
      throw Exception('Producto no encontrado');
    } else {
      final error = json.decode(response.body);
      throw Exception('Error al actualizar producto: ${error['message']}');
    }
  }

  // DELETE /api/products/:id
  static Future<void> deleteProduct(String id) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/products/$id'),
      headers: _headers,
    );

    if (response.statusCode != 200) {
      final error = json.decode(response.body);
      throw Exception('Error al eliminar producto: ${error['message']}');
    }
  }

  // GET /api/products/categories
  static Future<List<String>> getCategories() async {
    final response = await http.get(
      Uri.parse('$baseUrl/products/categories'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return List<String>.from(data['data']);
    } else {
      throw Exception('Error al cargar categorías: ${response.statusCode}');
    }
  }
}
```

### 4. Provider/Bloc para Estado

```dart
// lib/providers/product_provider.dart
import 'package:flutter/foundation.dart';
import '../models/product.dart';
import '../services/api_service.dart';

class ProductProvider with ChangeNotifier {
  List<Product> _products = [];
  bool _isLoading = false;
  String? _error;

  List<Product> get products => _products;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadProducts({
    int page = 1,
    int limit = 10,
    String? category,
    double? minPrice,
    double? maxPrice,
    String? search,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _products = await ApiService.getProducts(
        page: page,
        limit: limit,
        category: category,
        minPrice: minPrice,
        maxPrice: maxPrice,
        search: search,
      );
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> createProduct(Product product) async {
    try {
      final newProduct = await ApiService.createProduct(product);
      _products.add(newProduct);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  Future<void> updateProduct(String id, Map<String, dynamic> updates) async {
    try {
      final updatedProduct = await ApiService.updateProduct(id, updates);
      final index = _products.indexWhere((p) => p.id == id);
      if (index != -1) {
        _products[index] = updatedProduct;
        notifyListeners();
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  Future<void> deleteProduct(String id) async {
    try {
      await ApiService.deleteProduct(id);
      _products.removeWhere((p) => p.id == id);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }
}
```

### 5. Widget de Lista de Productos

```dart
// lib/widgets/product_list.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/product_provider.dart';
import '../models/product.dart';

class ProductList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<ProductProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading) {
          return Center(child: CircularProgressIndicator());
        }

        if (provider.error != null) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Error: ${provider.error}'),
                ElevatedButton(
                  onPressed: () => provider.loadProducts(),
                  child: Text('Reintentar'),
                ),
              ],
            ),
          );
        }

        return ListView.builder(
          itemCount: provider.products.length,
          itemBuilder: (context, index) {
            final product = provider.products[index];
            return ProductCard(product: product);
          },
        );
      },
    );
  }
}

class ProductCard extends StatelessWidget {
  final Product product;

  const ProductCard({Key? key, required this.product}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.all(8.0),
      child: ListTile(
        leading: CircleAvatar(
          backgroundImage: product.imageUrl.isNotEmpty
              ? NetworkImage(product.imageUrl)
              : null,
          child: product.imageUrl.isEmpty
              ? Icon(Icons.shopping_bag)
              : null,
        ),
        title: Text(product.name),
        subtitle: Text(product.description),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '\$${product.price.toStringAsFixed(2)}',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            Text(
              'Stock: ${product.stock}',
              style: TextStyle(fontSize: 12),
            ),
          ],
        ),
        onTap: () {
          // Navegar a detalles del producto
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => ProductDetail(product: product),
            ),
          );
        },
      ),
    );
  }
}
```

### 6. Configuración de Red

Para desarrollo en Android, agrega esta configuración en `android/app/src/main/AndroidManifest.xml`:

```xml
<application
    android:usesCleartextTraffic="true"
    ...>
```

Para iOS, agrega en `ios/Runner/Info.plist`:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

## 🔧 Configuración de Desarrollo

### 1. Cambiar URL para diferentes entornos

```dart
// lib/config/api_config.dart
class ApiConfig {
  static const String development = 'http://localhost:3000/api';
  static const String production = 'https://tu-api.com/api';
  
  static String get baseUrl {
    if (kDebugMode) {
      return development;
    } else {
      return production;
    }
  }
}
```

### 2. Manejo de Errores Global

```dart
// lib/utils/error_handler.dart
class ErrorHandler {
  static String getErrorMessage(dynamic error) {
    if (error.toString().contains('SocketException')) {
      return 'Error de conexión. Verifica tu conexión a internet.';
    } else if (error.toString().contains('404')) {
      return 'Recurso no encontrado.';
    } else if (error.toString().contains('500')) {
      return 'Error del servidor. Intenta más tarde.';
    } else {
      return 'Error inesperado: ${error.toString()}';
    }
  }
}
```

## 📱 Ejemplo de Uso Completo

```dart
// lib/screens/home_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/product_provider.dart';
import '../widgets/product_list.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    // Cargar productos al inicializar
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ProductProvider>().loadProducts();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Productos'),
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: () {
              context.read<ProductProvider>().loadProducts();
            },
          ),
        ],
      ),
      body: ProductList(),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Navegar a formulario de creación
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => CreateProductScreen(),
            ),
          );
        },
        child: Icon(Icons.add),
      ),
    );
  }
}
```

## 🚀 Comandos Útiles

```bash
# Generar código para modelos
flutter packages pub run build_runner build

# Limpiar y regenerar
flutter packages pub run build_runner build --delete-conflicting-outputs

# Ejecutar en modo debug
flutter run

# Ejecutar en modo release
flutter run --release
```

## 📝 Notas Importantes

1. **CORS**: La API está configurada para aceptar peticiones desde Flutter
2. **Rate Limiting**: Máximo 100 requests por 15 minutos
3. **Validaciones**: Todos los endpoints tienen validaciones robustas
4. **Paginación**: Implementa paginación para listas grandes
5. **Manejo de Errores**: Usa try-catch para manejar errores de red
6. **Estado**: Considera usar Provider, Bloc o Riverpod para manejo de estado

## 🔍 Debugging

Para debuggear las peticiones HTTP, puedes usar:

```dart
// En tu main.dart
import 'package:dio/dio.dart';

void main() {
  Dio dio = Dio();
  dio.interceptors.add(LogInterceptor(
    requestBody: true,
    responseBody: true,
  ));
  runApp(MyApp());
}
```

Esto te permitirá ver todas las peticiones y respuestas en la consola.

