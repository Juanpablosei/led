# Guía de Fuentes Aeonik

## Configuración Global
Las fuentes Aeonik están configuradas para aplicarse automáticamente a toda la aplicación.

## Fuentes Disponibles
- **Aeonik-Regular**: Peso normal
- **Aeonik-Bold**: Peso negrita
- **Aeonik-Light**: Peso ligero
- **Aeonik-RegularItalic**: Normal itálica
- **Aeonik-BoldItalic**: Negrita itálica
- **Aeonik-LightItalic**: Ligera itálica

## Uso Automático
Todos los componentes `Text` y `TextInput` usan automáticamente Aeonik-Regular.

## Uso Manual

### 1. Usando la tipografía predefinida:
```typescript
import { typography } from '../constants';

const styles = StyleSheet.create({
  title: {
    ...typography.title, // Usa Aeonik-Bold automáticamente
  },
  body: {
    ...typography.body, // Usa Aeonik-Regular automáticamente
  }
});
```

### 2. Usando getFontFamily:
```typescript
import { getFontFamily } from '../constants';

const styles = StyleSheet.create({
  customText: {
    fontFamily: getFontFamily('bold'),
    fontSize: 18,
  },
  italicText: {
    fontFamily: getFontFamily('regular', true), // Itálica
    fontSize: 16,
  }
});
```

### 3. Usando CustomText:
```typescript
import { CustomText } from '../components/global';

<CustomText weight="bold" italic={true}>
  Texto en negrita itálica
</CustomText>
```

### 4. Usando estilos globales:
```typescript
import { globalStyles } from '../constants';

<Text style={globalStyles.textBold}>
  Texto en negrita
</Text>
```

## Fallback
Si las fuentes Aeonik no están disponibles, se usará la fuente del sistema como fallback.
