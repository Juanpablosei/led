# LEDAT - Aplicación de Gestión de Edificios

## 📱 Descripción

LEDAT es una aplicación móvil desarrollada con React Native y Expo para la gestión integral de edificios. La aplicación permite a los usuarios administrar documentos, comunicaciones, usuarios y datos de edificios de manera eficiente y segura.

## 🚀 Características Principales

### 🔐 Autenticación y Seguridad
- **Login dual**: Acceso General y Acceso Edificio
- **Autenticación biométrica**: Face ID (iOS) y Touch ID (Android)
- **Recordar credenciales**: Opción para recordar NIF y contraseña
- **Validación de contraseñas**: Mínimo 8 caracteres con al menos una letra

### 📄 Gestión de Documentos
- **Creación de documentos**: Subida de archivos PDF (máximo 10MB)
- **Categorización**: Documentos técnicos, administrativos y jurídicos
- **Fechas de validez**: Sistema de calendario integrado
- **Permisos granulares**: Control de acceso basado en perfiles de usuario
- **Modo solo lectura**: Visualización sin edición para usuarios limitados

### 💬 Comunicaciones
- **Envío de emails**: Sistema de comunicación integrado
- **Editor de texto enriquecido**: Para mensajes complejos
- **Gestión de usuarios**: Lista de destinatarios dinámica

### 🏢 Gestión de Edificios
- **Información detallada**: Datos completos de cada edificio
- **Imágenes**: Visualización optimizada de imágenes de edificios
- **Navegación inteligente**: Sistema de navegación contextual

### 👥 Gestión de Usuarios
- **Perfiles de usuario**: Diferentes niveles de acceso
- **Datos personales**: Gestión completa de información del usuario
- **Cambio de contraseñas**: Integrado en el perfil de usuario

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React Native**: 0.81.4
- **Expo**: ~54.0.10
- **TypeScript**: ~5.9.2
- **Expo Router**: ~6.0.8 (Navegación basada en archivos)

### Autenticación
- **expo-local-authentication**: ~17.0.7 (Biometría)
- **@react-native-async-storage/async-storage**: ^2.2.0 (Almacenamiento local)

### UI/UX
- **@expo/vector-icons**: ^15.0.2 (Iconografía)
- **react-native-modal-datetime-picker**: ^18.0.0 (Calendarios)
- **react-native-pell-rich-editor**: ^1.10.0 (Editor de texto)
- **expo-document-picker**: ~14.0.7 (Selección de archivos)

### Comunicación
- **axios**: ^1.12.2 (HTTP client)
- **expo-notifications**: ~0.32.12 (Notificaciones push)

## 📁 Estructura del Proyecto

```
ledat/
├── app/                          # Páginas de la aplicación (Expo Router)
│   ├── (tabs)/                   # Navegación por pestañas
│   │   ├── index.tsx            # Pantalla principal
│   │   └── explore.tsx          # Pantalla de exploración
│   ├── _layout.tsx              # Layout raíz
│   ├── login.tsx                # Pantalla de login
│   ├── buildings.tsx            # Lista de edificios
│   ├── building-detail.tsx      # Detalle de edificio
│   ├── documents.tsx            # Gestión de documentos
│   ├── communications.tsx       # Comunicaciones
│   ├── users.tsx                # Gestión de usuarios
│   ├── my-data.tsx              # Mis datos
│   ├── notifications.tsx        # Notificaciones
│   ├── alerts.tsx               # Alertas
│   └── send-email.tsx           # Envío de emails
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── auth/                # Componentes de autenticación
│   │   ├── documents/           # Componentes de documentos
│   │   ├── login/               # Componentes de login
│   │   ├── sidebar/             # Navegación lateral
│   │   ├── home/                # Componentes de inicio
│   │   ├── modals/              # Modales
│   │   └── ui/                  # Componentes UI básicos
│   ├── screens/                 # Pantallas principales
│   ├── services/                # Servicios de API
│   ├── hooks/                   # Hooks personalizados
│   ├── contexts/                # Contextos de React
│   ├── constants/               # Constantes de la aplicación
│   ├── types/                   # Definiciones de tipos TypeScript
│   ├── utils/                   # Utilidades
│   └── locales/                 # Archivos de traducción
├── assets/                      # Recursos estáticos
└── dist/                        # Build de producción
```

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Expo CLI
- Android Studio (para Android)
- Xcode (para iOS)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd ledat
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env con las configuraciones necesarias
API_BASE_URL=https://api.ejemplo.com
```

4. **Iniciar el servidor de desarrollo**
```bash
npm start
```

5. **Ejecutar en dispositivo**
```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 🎨 Sistema de Diseño

### Colores
```typescript
export const colors = {
  primary: '#E95460',        // Rojo principal
  secondary: '#4A90E2',      // Azul secundario
  background: '#F8F9FA',     // Fondo claro
  white: '#FFFFFF',          // Blanco
  text: '#333333',           // Texto principal
  gray: '#666666',           // Texto secundario
  lightGray: '#E0E0E0',      // Bordes y separadores
  error: '#FF4444',          // Errores
  success: '#00C851',        // Éxito
  warning: '#FF8800',        // Advertencias
}
```

### Tipografía
- **Títulos**: 20px, bold
- **Subtítulos**: 18px, semibold
- **Texto normal**: 16px, regular
- **Texto pequeño**: 14px, regular
- **Texto de ayuda**: 12px, regular

### Espaciado
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px

## 🔐 Autenticación

### Tipos de Acceso

#### Acceso General
- Acceso completo a todos los edificios
- Gestión de usuarios y comunicaciones
- Navegación completa del sistema

#### Acceso Edificio
- Acceso limitado a un edificio específico
- Funcionalidades restringidas según perfil
- Navegación simplificada

### Autenticación Biométrica

La aplicación soporta autenticación biométrica en ambas plataformas:

```typescript
// Configuración de biometría
const biometricConfig = {
  ios: 'Face ID',
  android: 'Touch ID / Huella dactilar',
  fallback: 'Contraseña tradicional'
}
```

### Almacenamiento Seguro

Las credenciales se almacenan de forma segura usando:
- AsyncStorage para preferencias del usuario
- Encriptación local para datos sensibles
- Limpieza automática en logout

## 📄 Gestión de Documentos

### Tipos de Documentos
- **Técnicos**: Inspecciones, certificados, informes
- **Administrativos**: Contratos, permisos, licencias
- **Jurídicos**: Documentos legales, normativas

### Permisos por Perfil
- **ID 1**: Administrador completo
- **ID 3**: Editor de documentos
- **ID 4**: Gestión de usuarios
- **Otros IDs**: Solo lectura

### Funcionalidades
- **Subida de archivos**: PDF, máximo 10MB
- **Fechas de validez**: Con calendario integrado
- **Categorización automática**: Según tipo de edificio
- **Modo offline**: Visualización de documentos descargados

## 💬 Sistema de Comunicaciones

### Características
- **Editor de texto enriquecido**: Formato completo de mensajes
- **Adjuntos**: Soporte para archivos PDF
- **Destinatarios múltiples**: Selección de usuarios
- **Plantillas**: Mensajes predefinidos
- **Historial**: Registro de comunicaciones enviadas

### Integración
- **API de emails**: Envío directo desde la aplicación
- **Notificaciones push**: Confirmación de entrega
- **Estados de lectura**: Seguimiento de mensajes

## 🌍 Internacionalización

La aplicación soporta múltiples idiomas:

### Idiomas Soportados
- **Español** (es): Idioma principal
- **Catalán** (ca): Idioma secundario

### Archivos de Traducción
```
src/locales/
├── es/
│   ├── common.json
│   ├── navigation.json
│   ├── documents.json
│   ├── users.json
│   ├── communications.json
│   ├── myData.json
│   ├── notifications.json
│   └── errors.json
└── ca/
    └── [mismos archivos en catalán]
```

### Uso de Traducciones
```typescript
import { useTranslation } from '../hooks/useTranslation';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <Text>{t('welcome')}</Text>;
};
```

## 🔧 API y Servicios

### Base URL
```
https://api.ledat.com
```

### Autenticación
Todos los endpoints protegidos requieren el header:
```
Authorization: Bearer {token}
Accept-Language: es|ca
```

---

## 🔐 **AUTENTICACIÓN**

### 1. Login General
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "nif": "12345678A",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "status": true,
  "message": "Login exitoso",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "channel_code": "channel_123",
  "token_user_notification": "notification_token_123",
  "datos_profesionales": true,
  "code": 200
}
```

**Response Error (401):**
```json
{
  "status": false,
  "message": "Credenciales inválidas",
  "code": 401
}
```

### 2. Login Edificio
**Endpoint:** `POST /auth/login_usuario_edificio`

**Request Body:**
```json
{
  "nif": "12345678A",
  "code": "123456"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "edificio": {
    "id": 123,
    "nom": "Edificio Ejemplo",
    "ref_cadastral": "1234567890",
    "estado": "activo",
    "perfil_llibre": [
      {
        "id": 1,
        "name": "Administrador"
      }
    ]
  },
  "roles": [
    {
      "id": 1,
      "role_llibre_id": 1,
      "edifici_usuari_id": 456
    }
  ],
  "code": 200
}
```

### 3. Olvidé Contraseña
**Endpoint:** `POST /auth/forgo_password`

**Request Body:**
```json
{
  "nif": "12345678A"
}
```

**Response Success (200):**
```json
{
  "status": true,
  "message": "Email de recuperación enviado",
  "code": 200
}
```

### 4. Olvidé Código Edificio
**Endpoint:** `POST /auth/forgo_code_edificio`

**Request Body:**
```json
{
  "nif": "12345678A"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Lista de edificios enviada",
  "data": [
    {
      "id": 123,
      "nom": "Edificio Ejemplo",
      "ref_cadastral": "1234567890"
    }
  ],
  "code": 200
}
```

### 5. Enviar Código a Edificio
**Endpoint:** `GET /auth/send_code_edificio/{edificio_id}`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Código enviado al edificio",
  "code": 200
}
```

### 6. Registrar Usuario
**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "nif": "12345678A",
  "password": "password123",
  "password_confirmation": "password123",
  "first_name": "Juan",
  "last_name": "Pérez",
  "comunitat_autonoma": "Cataluña",
  "professio": 1,
  "otra_profesion": "Arquitecto especializado",
  "colegiado_externo_num_colegiado": "12345",
  "collegi_professional": "Colegio de Arquitectos",
  "entitat_conveni_id": "1",
  "politica_privacitat_acceptada_en": true,
  "tipo_usuario": "profesional"
}
```

**Response Success (201):**
```json
{
  "status": true,
  "message": "Usuario registrado exitosamente",
  "code": 201,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 7. Mis Datos - Obtener
**Endpoint:** `GET /mis-datos`

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "id": 123,
    "email": "usuario@ejemplo.com",
    "first_name": "Juan",
    "last_name": "Pérez",
    "nif": "12345678A",
    "telefon": "123456789",
    "tipo_usuario": "profesional",
    "professio": 1,
    "otra_profesion": "Arquitecto",
    "colegiado_externo_num_colegiado": "12345",
    "collegi_professional": "Colegio de Arquitectos",
    "comunitat_autonoma": "Cataluña",
    "entitat_conveni_id": 1,
    "role_altres": "Director de proyecto",
    "locale": "es",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### 8. Mis Datos - Actualizar
**Endpoint:** `PATCH /mis-datos`

**Request Body:**
```json
{
  "professio": "1",
  "colegiado_externo_num_colegiado": "12345",
  "collegi_professional": "Colegio de Arquitectos",
  "role_altres": "Director de proyecto",
  "telefon": "123456789",
  "email": "usuario@ejemplo.com",
  "comunitat_autonoma": "Cataluña",
  "entidad_convenio": "1",
  "tipo_usuario": "profesional",
  "otra_profesion": "Arquitecto especializado",
  "password": "nuevapassword123",
  "password_confirmation": "nuevapassword123"
}
```

**Response Success (200):**
```json
{
  "status": true,
  "message": "Datos actualizados correctamente",
  "data": {
    "id": 123,
    "email": "usuario@ejemplo.com",
    "first_name": "Juan",
    "last_name": "Pérez"
  }
}
```

### 9. Registrar Dispositivo
**Endpoint:** `POST /register-device`

**Request Body:**
```json
{
  "device_id": "unique-device-id",
  "expoPushToken": "ExponentPushToken[xxx]"
}
```

**Response Success (200):**
```json
{
  "status": true,
  "message": "Dispositivo registrado exitosamente"
}
```

---

## 🏢 **EDIFICIOS**

### 1. Listar Edificios
**Endpoint:** `GET /edificio?page={page}&magic={search}`

**Query Parameters:**
- `page` (number): Página de resultados (default: 1)
- `magic` (string): Texto de búsqueda opcional

**Response Success (200):**
```json
{
  "status": true,
  "message": "Edificios obtenidos",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 123,
        "nom": "Edificio Ejemplo",
        "tipus_edifici_id": 1,
        "ref_cadastral": "1234567890",
        "versio_estesa": true,
        "created_at": "2024-01-01T00:00:00Z",
        "fecha_contratacion_led_redaccion": "2024-01-01",
        "fecha_contratacion_led_gestion": "2024-01-01",
        "fecha_limite_uso": "2025-01-01",
        "user_id": 456,
        "deleted_at": null,
        "comunitat_autonoma": "Cataluña",
        "revisado": "2024-01-01",
        "alias_tarifa_aplicada": "Tarifa A",
        "estado": "activo",
        "propietario": true,
        "sincronizado": true,
        "es_catastro": false,
        "fecha_contratacion": "2024-01-01",
        "tipus_edifici": "Residencial",
        "perfil_llibre": [
          {
            "id": 1,
            "name": "Administrador"
          },
          {
            "id": 3,
            "name": "Editor"
          }
        ],
        "identificacion": [
          {
            "id": 1,
            "tipus_via": "Calle",
            "via": "Mayor",
            "numero": "123",
            "bloc": "A",
            "escala": "1",
            "codi_postal": "08001",
            "poblacio": "Barcelona",
            "provincia": "Barcelona",
            "any_inici_construccio": 2020,
            "any_fi_construccio": 2022,
            "origen_any_construccio": "Catastro",
            "observacions": null,
            "ref_cadastral": "1234567890",
            "direccion": "Calle Mayor 123, Barcelona"
          }
        ],
        "propiedad": [],
        "imagen": "https://api.ledat.com/images/edificio123.jpg",
        "planos": []
      }
    ],
    "first_page_url": "https://api.ledat.com/edificio?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": "https://api.ledat.com/edificio?page=5",
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      },
      {
        "url": "https://api.ledat.com/edificio?page=1",
        "label": "1",
        "active": true
      }
    ],
    "next_page_url": "https://api.ledat.com/edificio?page=2",
    "path": "https://api.ledat.com/edificio",
    "per_page": 15,
    "prev_page_url": null,
    "to": 15,
    "total": 75
  }
}
```

### 2. Detalle de Edificio
**Endpoint:** `GET /edificio/{id}`

**Response Success (200):**
```json
{
  "status": true,
  "message": "Edificio obtenido",
  "data": {
    "id": 123,
    "nom": "Edificio Ejemplo",
    "tipus_edifici_id": 1,
    "ref_cadastral": "1234567890",
    "versio_estesa": true,
    "created_at": "2024-01-01T00:00:00Z",
    "fecha_contratacion_led_redaccion": "2024-01-01",
    "fecha_contratacion_led_gestion": "2024-01-01",
    "fecha_limite_uso": "2025-01-01",
    "user_id": 456,
    "tipus_producte": {
      "id": 1,
      "producte": "LED Redacción + Gestión"
    },
    "usuario": {
      "id": 456,
      "first_name": "Juan",
      "last_name": "Pérez",
      "nif": "12345678A",
      "collegi_professional": "Colegio de Arquitectos"
    },
    "inmuebles": [
      {
        "id": 789,
        "edifici_id": 123,
        "ref_cadastral": "1234567890001",
        "localitzacio": "1º A",
        "us": "Vivienda",
        "superficie": "85.50",
        "any_construccio": 2020,
        "coeficient": "1.00",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "no_existeix_cadastre": false,
        "habitatge_actiu": true,
        "es_manual": null
      }
    ],
    "data_anulacio": null,
    "data_confirmacio": "2024-01-01T00:00:00Z",
    "usuario_estado_edificio": true,
    "perfil_llibre": [
      {
        "id": 1,
        "name": "Administrador"
      },
      {
        "id": 3,
        "name": "Editor"
      },
      {
        "id": 4,
        "name": "Gestión de usuarios"
      }
    ]
  }
}
```

---

## 📄 **DOCUMENTOS**

### 1. Obtener Documentos del Edificio
**Endpoint:** `GET /edificio_documentos?ultimaversion=true&edifici_id={id}`

**Query Parameters:**
- `ultimaversion` (boolean): Solo última versión (default: true)
- `edifici_id` (number): ID del edificio

**Response Success (200):**
```json
{
  "status": true,
  "message": "Documentos obtenidos",
  "data": {
    "edif_doc_tecnica": [
      {
        "id": 456,
        "edifici_id": 123,
        "tipus_document": "Inspección Técnica",
        "nom": "ITE 2024",
        "nom_arxiu": "ite_2024.pdf",
        "hash_arxiu": "abc123def456",
        "data_validesa": "2025-12-31",
        "afegir_al_libre": true,
        "ultima_version": true,
        "descripcio": "Inspección técnica del edificio",
        "created_at": "2024-01-01T00:00:00Z",
        "es_protegido": false,
        "doc_params_id": "1",
        "doc_params_padre_id": "1",
        "doc_params_order": 1,
        "doc_params_actiu": true,
        "parent_params_order": 1,
        "ruta": "/documents/ite_2024.pdf",
        "tipus": "técnica",
        "tiene_historico": false
      }
    ],
    "edif_doc_admin": [
      {
        "id": 457,
        "edifici_id": 123,
        "tipus_document": "Contrato de Seguro",
        "nom": "Seguro Edificio 2024",
        "nom_arxiu": "seguro_2024.pdf",
        "hash_arxiu": "def456ghi789",
        "data_validesa": "2024-12-31",
        "afegir_al_libre": false,
        "ultima_version": true,
        "descripcio": "Póliza de seguro del edificio",
        "created_at": "2024-01-01T00:00:00Z",
        "es_protegido": false,
        "doc_params_id": "2",
        "doc_params_padre_id": "2",
        "doc_params_order": 1,
        "doc_params_actiu": true,
        "parent_params_order": 1,
        "ruta": "/documents/seguro_2024.pdf",
        "tipus": "administrativa",
        "tiene_historico": false
      }
    ],
    "edif_doc_juridica": [],
    "edif_doc_otros": []
  }
}
```

### 2. Crear Documento
**Endpoint:** `POST /edificio_documentos`

**Content-Type:** `multipart/form-data`

**Form Data:**
```json
{
  "edifici_id": "123",
  "nom": "Nuevo Documento",
  "tipus_document": "1",
  "file": "[File Object]",
  "data_validesa": "2025-12-31",
  "afegir_al_libre": "true"
}
```

**Response Success (201):**
```json
{
  "status": true,
  "message": "Documento creado exitosamente",
  "data": {
    "id": 458,
    "edifici_id": 123,
    "nom": "Nuevo Documento",
    "tipus_document": "1",
    "data_validesa": "2025-12-31",
    "afegir_al_libre": true
  }
}
```

### 3. Actualizar Documento
**Endpoint:** `POST /edificio_documentos/{id}?_method=PATCH`

**Content-Type:** `multipart/form-data`

**Form Data:**
```json
{
  "_method": "PATCH",
  "edifici_id": "123",
  "nom": "Documento Actualizado",
  "tipus_document": "1",
  "file": "[File Object]",
  "data_validesa": "2025-12-31",
  "afegir_al_libre": "true"
}
```

**Response Success (200):**
```json
{
  "status": true,
  "message": "Documento actualizado exitosamente",
  "data": {
    "id": 458,
    "nom": "Documento Actualizado",
    "tipus_document": "1",
    "data_validesa": "2025-12-31",
    "afegir_al_libre": true
  }
}
```

### 4. Eliminar Documento
**Endpoint:** `DELETE /edificio_documentos/{id}`

**Response Success (200):**
```json
{
  "status": true,
  "message": "Documento eliminado exitosamente"
}
```

### 5. Obtener Tipos de Documentos
**Endpoint:** `POST /maestros/parametros-publicos`

**Request Body:**
```json
[
  {
    "parametroPadre": "edif_doc_tecnica"
  }
]
```

**Response Success (200):**
```json
{
  "edif_doc_tecnica": {
    "1": "Inspección Técnica de Edificios",
    "2": "Certificado de Instalaciones",
    "3": "Informe de Seguridad",
    "4": "Plano de Instalaciones",
    "5": "Manual de Mantenimiento"
  }
}
```

---

## 💬 **COMUNICACIONES**

### 1. Listar Comunicaciones del Edificio
**Endpoint:** `GET /comunicaciones/comunicaciones_edificios/{id}?page={page}&limit={limit}`

**Query Parameters:**
- `page` (number): Página de resultados (default: 1)
- `limit` (number): Elementos por página (default: 15)

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 789,
        "assumpte": "Recordatorio ITE",
        "message": "Se recuerda que la ITE caduca el 31/12/2024",
        "tipus": "recordatorio",
        "descripcio": "Recordatorio de caducidad de documentos",
        "total_comunicacions": 25,
        "total_enviades": 25,
        "total_no_enviades": 0,
        "plantilles_email_id": 1,
        "remitent_id": 456,
        "creat_per_id": 456,
        "modul_relacionat_id": null,
        "modulo_relacionat": null,
        "data_inici": "2024-01-01T00:00:00Z",
        "data_fin": "2024-01-01T23:59:59Z",
        "data_enviada": "2024-01-01T10:00:00Z",
        "remitent_nom": "Juan Pérez",
        "remitent_email": "juan@ejemplo.com",
        "edifici_id": 123,
        "timestamp_en_proceso": null,
        "first_name": "Juan",
        "last_name": "Pérez",
        "destinatarios": [
          {
            "id": 101,
            "comunicacio_id": 789,
            "destinatari_id": 789,
            "destinatari_email": "propietario@ejemplo.com",
            "assumpte": "Recordatorio ITE",
            "message": "Se recuerda que la ITE caduca el 31/12/2024",
            "estat": "enviado",
            "error": null,
            "data_enviada": "2024-01-01T10:00:00Z",
            "leido": true
          }
        ],
        "adjuntos": [
          {
            "id": 201,
            "comunicacio_id": 789,
            "comunicacio_destinatari_id": 101,
            "ruta_adjunt": "/attachments/documento.pdf",
            "nombre_adjunt": "documento.pdf"
          }
        ]
      }
    ],
    "first_page_url": "https://api.ledat.com/comunicaciones/comunicaciones_edificios/123?page=1",
    "from": 1,
    "last_page": 2,
    "last_page_url": "https://api.ledat.com/comunicaciones/comunicaciones_edificios/123?page=2",
    "links": [
      {
        "url": null,
        "label": "&laquo; Previous",
        "active": false
      }
    ],
    "next_page_url": "https://api.ledat.com/comunicaciones/comunicaciones_edificios/123?page=2",
    "path": "https://api.ledat.com/comunicaciones/comunicaciones_edificios/123",
    "per_page": 15,
    "prev_page_url": null,
    "to": 15,
    "total": 30
  }
}
```

### 2. Detalle de Comunicación
**Endpoint:** `GET /comunicaciones/my_comunicacion/{id}`

**Response Success (200):**
```json
{
  "status": true,
  "message": "Comunicación obtenida",
  "data": {
    "id": 789,
    "assumpte": "Recordatorio ITE",
    "cos": "<p>Se recuerda que la Inspección Técnica de Edificios caduca el 31 de diciembre de 2024.</p>",
    "data_enviament": "2024-01-01T10:00:00Z",
    "emisor": "Juan Pérez",
    "edifici_id": 123,
    "edifici_nom": "Edificio Ejemplo",
    "leido": "2024-01-01T10:05:00Z"
  }
}
```

### 3. Marcar Comunicación como Leída
**Endpoint:** `PATCH /comunicaciones/mensaje_leido?id={id}&leido={leido}`

**Query Parameters:**
- `id` (number): ID de la comunicación
- `leido` (boolean): true para marcar como leída, false para marcar como no leída

**Response Success (200):**
```json
{
  "status": true,
  "message": "Comunicación marcada como leída"
}
```

### 4. Enviar Email del Edificio
**Endpoint:** `POST /comunicaciones/comunicacion_edificio`

**Request Body:**
```json
{
  "assumpte": "Asunto del email",
  "message": "<p>Contenido del mensaje en HTML</p>",
  "plantilles_email_id": 1,
  "edifici_id": "123",
  "lista_ids": ["1", "2", "3"],
  "adjuntos": [
    {
      "base64": "data:application/pdf;base64,JVBERi0xLjQK...",
      "nombre": "documento.pdf"
    }
  ]
}
```

**Response Success (200):**
```json
{
  "status": true,
  "message": "Email enviado exitosamente"
}
```

---

## 👥 **USUARIOS**

### 1. Listar Usuarios del Edificio
**Endpoint:** `GET /edificio_usuarios?page={page}&limit={limit}&edifici_id={id}`

**Query Parameters:**
- `page` (number): Página de resultados (default: 1)
- `limit` (number): Elementos por página (default: 15)
- `edifici_id` (number): ID del edificio

**Response Success (200):**
```json
{
  "status": true,
  "message": "Usuarios obtenidos",
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 101,
        "user_id": 789,
        "first_name": "María",
        "last_name": "García",
        "nif": "87654321B",
        "email": "maria@ejemplo.com",
        "telefon": "987654321",
        "roles": ["Propietario", "Administrador"],
        "verificado": true
      }
    ],
    "first_page_url": "https://api.ledat.com/edificio_usuarios?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "https://api.ledat.com/edificio_usuarios?page=1",
    "next_page_url": null,
    "path": "https://api.ledat.com/edificio_usuarios",
    "per_page": 15,
    "prev_page_url": null,
    "to": 5,
    "total": 5
  }
}
```

---

## 🔔 **NOTIFICACIONES**

### 1. Obtener Notificaciones
**Endpoint:** `GET /edificio/notificaciones/listar?limit={limit}&full={full}`

**Query Parameters:**
- `limit` (number): Límite de notificaciones (default: 5)
- `full` (boolean): Información completa (default: true)

**Response Success (200):**
```json
{
  "status": true,
  "message": "Notificaciones obtenidas",
  "data": {
    "documentos_edificio_caducados": {
      "cantidad": 2,
      "documentos": {
        "123": [
          {
            "id": 456,
            "edifici_nom": "Edificio Ejemplo",
            "edifici_id": 123,
            "tipus_document": "ITE",
            "nom": "ITE 2023",
            "hash_arxiu": "abc123def456",
            "data_validesa": "2024-01-01",
            "ocultar_notificacion": false,
            "texto": "La ITE ha caducado",
            "ruta": "/documents/ite_2023.pdf",
            "tipus": "técnica"
          }
        ]
      }
    },
    "documentos_inmueble_caducados": {
      "cantidad": 0,
      "documentos": {}
    },
    "comunicaciones_no_leidas": {
      "cantidad": 3,
      "comunicaciones": [
        {
          "id": 789,
          "assumpte": "Nueva comunicación",
          "leido": null,
          "edifici_id": 123,
          "edifici_nom": "Edificio Ejemplo"
        }
      ]
    },
    "actividades_proximas": {
      "cantidad": 1,
      "actividades": {
        "123": [
          {
            "id": 101,
            "titol": "Revisión anual",
            "edifici_id": 123,
            "edifici_nom": "Edificio Ejemplo",
            "data_inici_calculada": "2024-02-01",
            "durada_mesos": 1,
            "tipus_intervencio": "Mantenimiento",
            "descripcio": "Revisión anual de instalaciones",
            "sistema_id": 1,
            "projecte_id": 201,
            "projecte_nom": "Mantenimiento 2024",
            "projecte_estat": "programado"
          }
        ]
      }
    }
  }
}
```

### 2. Ocultar Notificación de Documento
**Endpoint:** `PATCH /edificio_documentos/notificaciones/{id}/ocultar`

**Response Success (200):**
```json
{
  "status": true,
  "message": "Notificación ocultada"
}
```

### 3. Ocultar Notificación de Actividad
**Endpoint:** `PATCH /edificio_proyectos/intervenciones/{id}/ocultar_notificacion`

**Response Success (200):**
```json
{
  "status": true,
  "message": "Notificación ocultada"
}
```

---

## 🏗️ **APROBACIÓN DE EDIFICIOS**

### 1. Aprobar Edificio
**Endpoint:** `POST /edificio_usuarios/comprobacion/aprobar/id:{id}`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Edificio aprobado exitosamente",
  "code": 200
}
```

### 2. Rechazar Edificio
**Endpoint:** `POST /edificio_usuarios/comprobacion/rechazar/id:{id}`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Edificio rechazado",
  "code": 200
}
```

---

## 📋 **MAESTROS Y PARÁMETROS**

### 1. Obtener Parámetros Públicos
**Endpoint:** `POST /maestros/parametros-publicos`

**Request Body:**
```json
[
  {
    "parametroPadre": "profesion"
  },
  {
    "parametroPadre": "entidadconvenio"
  },
  {
    "parametroPadre": "comunidadautonoma"
  }
]
```

**Response Success (200):**
```json
{
  "profesion": {
    "1": "Arquitecto",
    "2": "Ingeniero",
    "3": "Aparejador",
    "4": "Administrador de Fincas"
  },
  "entidadconvenio": {
    "1": "Colegio de Arquitectos",
    "2": "Colegio de Ingenieros",
    "3": "Colegio de Aparejadores"
  },
  "comunidadautonoma": {
    "1": "Andalucía",
    "2": "Aragón",
    "3": "Asturias",
    "4": "Baleares",
    "5": "Canarias",
    "6": "Cantabria",
    "7": "Castilla-La Mancha",
    "8": "Castilla y León",
    "9": "Cataluña",
    "10": "Comunidad Valenciana",
    "11": "Extremadura",
    "12": "Galicia",
    "13": "La Rioja",
    "14": "Madrid",
    "15": "Murcia",
    "16": "Navarra",
    "17": "País Vasco"
  }
}
```

### 2. Obtener Comunidades Autónomas
**Endpoint:** `GET /maestros/colegio-profesionales-publicos/comunidades-autonomas?tipo={tipo}`

**Query Parameters:**
- `tipo` (number): Tipo de colegio profesional

**Response Success (200):**
```json
{
  "1": "Andalucía",
  "2": "Aragón",
  "3": "Asturias",
  "4": "Baleares",
  "5": "Canarias",
  "6": "Cantabria",
  "7": "Castilla-La Mancha",
  "8": "Castilla y León",
  "9": "Cataluña",
  "10": "Comunidad Valenciana",
  "11": "Extremadura",
  "12": "Galicia",
  "13": "La Rioja",
  "14": "Madrid",
  "15": "Murcia",
  "16": "Navarra",
  "17": "País Vasco"
}
```

### 3. Obtener Colegios Profesionales
**Endpoint:** `GET /maestros/colegio-profesionales-publicos?comunitat={comunitat}&tipo={tipo}`

**Query Parameters:**
- `comunitat` (string): Comunidad autónoma
- `tipo` (number): Tipo de colegio profesional

**Response Success (200):**
```json
{
  "1": "Colegio Oficial de Arquitectos de Barcelona",
  "2": "Colegio Oficial de Arquitectos de Girona",
  "3": "Colegio Oficial de Arquitectos de Lleida",
  "4": "Colegio Oficial de Arquitectos de Tarragona"
}
```

---

## ⚠️ **CÓDIGOS DE ERROR**

### Códigos HTTP Comunes
- **200**: Éxito
- **201**: Creado exitosamente
- **400**: Error de validación
- **401**: No autorizado
- **403**: Prohibido
- **404**: No encontrado
- **422**: Error de validación de datos
- **500**: Error interno del servidor

### Estructura de Error
```json
{
  "status": false,
  "message": "Descripción del error",
  "code": 400,
  "errors": {
    "campo": ["El campo es obligatorio"]
  }
}
```

---

## 🔧 **CONFIGURACIÓN HTTP**

### Cliente HTTP Base
```typescript
const httpClient = axios.create({
  baseURL: 'https://api.ledat.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'es'
  }
});

// Interceptor para agregar token automáticamente
httpClient.interceptors.request.use((config) => {
  const token = AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Headers Requeridos
```
Authorization: Bearer {token}
Accept-Language: es|ca
Content-Type: application/json|multipart/form-data
```

## 🧪 Testing

### Scripts de Testing
```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Testing (cuando esté configurado)
npm test
```

### Estructura de Tests
```
__tests__/
├── components/
├── screens/
├── services/
└── utils/
```

## 📱 Build y Despliegue

### Desarrollo
```bash
# Servidor de desarrollo
npm start

# Build de desarrollo
expo build:android
expo build:ios
```

### Producción
```bash
# Build de producción
eas build --platform all

# Despliegue
eas submit --platform all
```

### Configuración EAS
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "aab"
      },
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  }
}
```

## 🔍 Debugging

### Herramientas de Debug
- **React Native Debugger**: Para debugging de Redux y React
- **Flipper**: Para debugging avanzado
- **Expo DevTools**: Herramientas integradas de Expo

### Logs
```typescript
// Sistema de logging
console.log('🔍 Debug info:', data);
console.log('✅ Success:', message);
console.log('❌ Error:', error);
console.log('🟡 Warning:', warning);
```

## 🚨 Troubleshooting

### Problemas Comunes

#### Error de Metros
```bash
# Limpiar cache de Metro
npx expo start --clear
```

#### Problemas de Dependencias
```bash
# Limpiar node_modules
rm -rf node_modules
npm install
```

#### Problemas de Build
```bash
# Limpiar cache de Expo
expo install --fix
```

### Logs de Error
- **Android**: `adb logcat`
- **iOS**: Xcode Console
- **Expo**: Expo DevTools

## 📈 Performance

### Optimizaciones Implementadas
- **Lazy loading**: Carga diferida de componentes
- **Image optimization**: Optimización automática de imágenes
- **Code splitting**: División de código por rutas
- **Memory management**: Gestión eficiente de memoria

### Métricas
- **Tiempo de carga inicial**: < 3 segundos
- **Tamaño de la app**: < 50MB
- **Memoria RAM**: < 100MB en uso

## 🔒 Seguridad

### Medidas Implementadas
- **Autenticación biométrica**: Face ID / Touch ID
- **Almacenamiento seguro**: AsyncStorage encriptado
- **Validación de entrada**: Sanitización de datos
- **HTTPS**: Comunicación encriptada
- **Tokens JWT**: Autenticación basada en tokens

### Permisos
```json
{
  "android": [
    "RECEIVE_BOOT_COMPLETED",
    "VIBRATE",
    "USE_FINGERPRINT",
    "CAMERA",
    "READ_EXTERNAL_STORAGE"
  ],
  "ios": [
    "NSCameraUsageDescription",
    "NSPhotoLibraryUsageDescription",
    "NSFaceIDUsageDescription"
  ]
}
```

## 🤝 Contribución

### Guías de Contribución
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de Código
- **ESLint**: Configuración estándar de Expo
- **Prettier**: Formateo automático
- **TypeScript**: Tipado estricto
- **Conventional Commits**: Mensajes de commit estandarizados

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollador Principal**: Pablo
- **Diseño UI/UX**: Equipo de diseño
- **QA**: Equipo de testing

## 📞 Soporte

Para soporte técnico o preguntas:
- **Email**: soporte@ledat.com
- **Documentación**: [docs.ledat.com](https://docs.ledat.com)
- **Issues**: [GitHub Issues](https://github.com/ledat/issues)

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Compatibilidad**: iOS 13+, Android 8+