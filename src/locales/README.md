# Sistema de Traducciones (i18n)

Este directorio contiene todos los archivos de traducción para la aplicación LEDAT.

## Estructura

```
locales/
├── es/                 # Traducciones en español
│   ├── common.json     # Textos comunes
│   ├── auth.json       # Textos de autenticación
│   └── navigation.json # Textos de navegación
└── ca/                 # Traducciones en catalán
    ├── common.json     # Textos comunes
    ├── auth.json       # Textos de autenticación
    └── navigation.json # Textos de navegación
```

## Uso

### 1. Hook useTranslation

```typescript
import { useTranslation } from '@/hooks/useTranslation';

const MyComponent = () => {
  const { t, currentLanguage, changeLanguage } = useTranslation();
  
  return (
    <Text>{t('welcome', 'common')}</Text>
  );
};
```

### 2. Función de traducción

- `t(key, namespace)` - Traduce una clave del namespace especificado
- `currentLanguage` - Idioma actual ('es' | 'ca')
- `changeLanguage(lang)` - Cambia el idioma
- `isLoading` - Estado de carga
- `availableLanguages` - Idiomas disponibles

### 3. Namespaces

- `common` - Textos comunes (botones, mensajes generales)
- `auth` - Textos de autenticación (login, registro)
- `navigation` - Textos de navegación (menús, tabs)

### 4. Agregar nuevas traducciones

1. Agregar la clave en el archivo JSON correspondiente
2. Usar `t('nuevaClave', 'namespace')` en el componente

### 5. Componente LanguageSelector

```typescript
import { LanguageSelector } from '@/components/language-selector/LanguageSelector';

<LanguageSelector />
```

## Configuración

El idioma se guarda automáticamente en AsyncStorage y se restaura al abrir la aplicación.

Idiomas soportados:
- `es` - Español (por defecto)
- `ca` - Catalán
