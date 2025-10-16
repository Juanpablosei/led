import { useEffect } from 'react';
import { Text, TextInput } from 'react-native';
import { getFontFamily } from '../constants/fonts';

// Hook para aplicar fuentes globalmente
export const useGlobalFonts = () => {
  useEffect(() => {
    // Configurar fuentes por defecto para todos los componentes Text
    const originalTextRender = Text.render;
    const originalTextInputRender = TextInput.render;

    // Aplicar fuente por defecto a todos los Text
    Text.render = function (props: any, ref: any) {
      const defaultStyle = {
        fontFamily: getFontFamily('regular'),
      };
      
      return originalTextRender.call(this, {
        ...props,
        style: [defaultStyle, props.style],
      }, ref);
    };

    // Aplicar fuente por defecto a todos los TextInput
    TextInput.render = function (props: any, ref: any) {
      const defaultStyle = {
        fontFamily: getFontFamily('regular'),
      };
      
      return originalTextInputRender.call(this, {
        ...props,
        style: [defaultStyle, props.style],
      }, ref);
    };

    // Cleanup function
    return () => {
      Text.render = originalTextRender;
      TextInput.render = originalTextInputRender;
    };
  }, []);
};
