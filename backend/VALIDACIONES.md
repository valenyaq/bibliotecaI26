# Sistema de Validación de Datos

Este documento describe el sistema de validación implementado en la aplicación Biblioteca Virtual.

## Tecnología Utilizada

Para la validación de datos se utiliza [Joi](https://joi.dev/), una potente biblioteca de validación de esquemas para JavaScript.

## Estructura de Validación

El sistema de validación está organizado de la siguiente manera:

1. **Esquemas de Validación** (`validation.schemas.js`):
   - Define los esquemas de validación para cada tipo de entidad (libros, valoraciones, géneros)
   - Especifica las reglas para cada campo (tipo, longitud, requerido, etc.)
   - Incluye mensajes de error personalizados para cada validación

2. **Middleware de Validación** (`joi.validation.middleware.js`):
   - Proporciona funciones middleware para Express
   - Valida los datos de entrada contra los esquemas definidos
   - Devuelve errores detallados si la validación falla

## Reglas de Validación Implementadas

### Libros

- **Título**:
  - Requerido
  - Debe ser texto
  - Longitud: 2-100 caracteres

- **Autor**:
  - Requerido
  - Debe ser texto
  - Longitud: 2-100 caracteres

- **Descripción**:
  - Opcional
  - Si se proporciona, debe ser texto
  - Longitud máxima: 2000 caracteres

- **Género ID**:
  - Opcional
  - Si se proporciona, debe ser un número entero positivo

### Valoraciones

- **Puntuación**:
  - Requerido
  - Debe ser un número entero
  - Rango: 1-5

- **Comentario**:
  - Opcional
  - Si se proporciona, debe ser texto
  - Longitud máxima: 500 caracteres

- **Nombre de Usuario**:
  - Requerido
  - Debe ser texto
  - Longitud: 2-50 caracteres

### Géneros

- **Nombre**:
  - Requerido
  - Debe ser texto
  - Longitud: 2-50 caracteres

## Cómo Funciona

1. Cuando se recibe una solicitud para crear o actualizar un recurso, los datos pasan primero por el middleware de validación.
2. El middleware valida los datos contra el esquema correspondiente.
3. Si la validación falla, se devuelve una respuesta de error con detalles sobre qué campos fallaron y por qué.
4. Si la validación es exitosa, la solicitud continúa al controlador correspondiente.
5. El controlador puede confiar en que los datos son válidos y procesarlos sin necesidad de validaciones adicionales.

## Ejemplos de Errores de Validación

```json
{
  "success": false,
  "message": "Datos inválidos",
  "errors": [
    "El título es obligatorio",
    "El autor debe tener al menos 2 caracteres",
    "La puntuación máxima es 5"
  ]
}
```

## Beneficios

- **Seguridad**: Previene la inserción de datos maliciosos o mal formados
- **Consistencia**: Garantiza que todos los datos cumplan con las reglas de negocio
- **Experiencia de usuario**: Proporciona mensajes de error claros y específicos
- **Mantenibilidad**: Centraliza la lógica de validación, facilitando cambios futuros
