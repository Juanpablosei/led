import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Linking, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { config } from '../../config/environment';
import { colors } from '../../constants/colors';
import { useTranslation } from '../../hooks/useTranslation';
import { styles } from './TermsAndConditionsModal.styles';
import { TermsAndConditionsModalProps } from './TermsAndConditionsModal.types';


// Importar el archivo como asset

export const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  visible,
  onClose,
  onAccept,
  onReject,
}) => {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const isExpanded = (sectionId: string) => expandedSections.has(sectionId);

  const handleFormDownload = () => {
    const downloadUrl = `${config.WEB_BASE_URL}/files/ES/Formulario%20de%20desistimiento%20LED%20032024.docx`;
    Linking.openURL(downloadUrl);
  };

  const renderTextWithLinks = (text: string) => {
    // Regex para detectar URLs (http/https y www)
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    // Regex para detectar "Modelo de formulario de desistimiento"
    const formRegex = /(Modelo de formulario de desistimiento\.)/g;
    
    // Primero dividir por URLs
    let parts = text.split(urlRegex);
    
    // Luego dividir cada parte por el texto del formulario
    parts = parts.flatMap(part => {
      if (urlRegex.test(part)) {
        return [part]; // Mantener URLs intactas
      }
      return part.split(formRegex);
    });
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        // Si es www, agregar https://
        const url = part.startsWith('www.') ? `https://${part}` : part;
        return (
          <Text
            key={index}
            style={styles.linkText}
            onPress={() => Linking.openURL(url)}
          >
            {part}
          </Text>
        );
      } else if (formRegex.test(part)) {
        return (
          <Text 
            key={index} 
            style={styles.primaryText}
            onPress={handleFormDownload}
          >
            {part}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  const sections = [
    {
      id: '1',
      title: '1. Ámbito de aplicación y objeto',
      subsections: [
        {
          id: '1.1',
          title: '1.1. Objeto',
          content: 'Los presentes términos y condiciones regularán la relación entre del Col·legi de l\'Arquitectura Tècnica de Barcelona (Cateb), titular de esta Web, y los Clientes que compren o contraten los productos y servicios ofrecidos en www.libroedificiodigital.es.\n\nEstas condiciones establecen las normas de contratación de los productos y servicios disponibles en www.libroedificiodigital.es, debiendo ser leídas y aceptadas por el Cliente previamente a la contratación.'
        },
        {
          id: '1.2',
          title: '1.2. Definiciones',
          content: 'Productos y Servicios. Se refiere a todos los productos y servicios (incluidos los digitales) ofrecidos en nuestro sitio web. A modo enunciativo, pero no limitativo están incluidas: las licencias de uso de las aplicaciones de pago único o bajo suscripción.\n\nEn cuanto a la definición de cada producto, se entenderá por: (1) "aplicaciones", software disponible a través de nuestro sitio web que requiera previo pago de un precio por licencia de uso mediante pago único o suscripción.\n\nUsuario. Será la persona física o jurídica que navegue a través de nuestra web o la que se dé de alta con nuestro perfil de usuario.\n\nCliente. Serán los usuarios que realicen compras o contrataciones de los productos y servicios disponibles en nuestro sitio web.\n\nConsumidores y usuarios. Adquirirán esta condición las personas físicas que actúen con un propósito ajeno a su actividad comercial, empresarial, oficio o profesión. También podrán adquirir la condición de consumidor y usuario las personas jurídicas y las entidades sin personalidad jurídica que actúen sin ánimo de lucro en un ámbito ajeno a una actividad comercial o empresarial.'
        },
        {
          id: '1.3',
          title: '1.3. Destinatarios de nuestros productos y servicios',
          content: 'Nuestros productos y servicios son de uso profesional, y están destinados a profesionales, empresas y/o agentes relacionados con las actividades de arquitectura y de construcción.\n\nEn caso de que el comprador reúna las condiciones legales establecidas para tener la condición de consumidor y usuario, resultará de aplicación el Real Decreto Legislativo 1/2007, de 16 de noviembre, por el que se aprueba el texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios y otras leyes complementarias. La definición de consumidor y usuario se encuentra en la cláusula 1.2. de las presentes condiciones.'
        },
        {
          id: '1.4',
          title: '1.4. Modificación de las condiciones',
          content: 'El CATEB se reserva el derecho a modificar, total o parcialmente, estas condiciones generales, siendo de aplicación las nuevas que acuerde desde el momento de su publicación en la página. En cualquier caso, las citadas modificaciones no tendrán efectos retroactivos sobre los productos y servicios previamente adquiridos.'
        }
      ]
    },
    {
      id: '2',
      title: '2. Idioma',
      content: 'Toda la información del web www.libroedificiodigital.es, en las transacciones comerciales o telefónicas, atención al público y los servicios ofrecidos serán en catalán y en castellano.'
    },
    {
      id: '3',
      title: '3. Proceso de contratación',
      subsections: [
        {
          id: '3.1',
          title: '3.1. Alta como usuario',
          content: 'Para realizar cualquier compra o contratación en nuestro sitio web el Cliente deberá registrarse previamente creando una cuenta de usuario.\n\nPara el alta como usuario se solicitarán datos personales que se consideran necesarios y mínimos para que CATEB pueda tramitar las solicitudes de compra y/o contratación, respetando en todo momento las disposiciones establecidas en el Reglamento UE 2016/679 y en la Ley Orgánica 3/20218, de 5 de diciembre, de Protección de Datos Personales. Para más información sobre el tratamiento que realiza CATEB sobre tus datos personales, puedes consultar nuestra Política de Privacidad.'
        },
        {
          id: '3.2',
          title: '3.2. Aceptación de las condiciones',
          content: 'La compra de los productos o servicios ofrecidos en la web se realizará cumplimentando los formularios y procedimientos electrónicos previstos en la web. El proceso se iniciará con la elección del producto o servicio y el seguimiento de los pasos indicados en la web, que suponen la aceptación de las condiciones generales y particulares de la compra de los productos de la web.\n\nLa confirmación de la contratación de los servicios se realizará a través de la activación del botón «Acepto las condiciones de contratación», que irá acompañada de una concisa información sobre el tratamiento de los datos personales que llevará a cabo CATEB. El botón de aceptación de las condiciones aparecerá una vez el usuario haya seleccionado los servicios en los que esté interesado y con anterioridad al pago o confirmación de su intención de contratar.\n\nEl usuario deberá leerse las presentes condiciones antes de aceptarlas, quedando vinculado a su cumplimiento desde el momento de la aceptación.\n\nLas presentes condiciones estarán disponibles para el usuario de manera permanente en nuestra página web.\n\nUna vez realizada la compra, en un plazo no superior a 24 horas, el cliente recibirá un justificante de su pedido.\n\nLa compra de los productos y servicios implican la autorización por parte del cliente de la emisión y el envío de la factura en soporte electrónico.'
        },
        {
          id: '3.3',
          title: '3.3. Requisitos de contratación',
          content: 'Para realizar cualquier compra en nuestro sitio web www.libroedificiodigital.es será necesario que el Cliente sea mayor de 18 años.\n\nLa compra y contratación en nuestro sitio web requerirá la previa alta como usuario, conforme se indica en el apartado 3.1. de estas condiciones. El Cliente deberá introducir sus credenciales de acceso como método de identificación en las compras y contrataciones que realice. Las credenciales de acceso estarán constituidas por un documento identificativo y contraseña elegida por el Cliente.\n\nUna vez realizado el pedido y confirmada la recepción de pago por parte de CATEB, el Cliente recibirá un correo electrónico donde se le confirmará la recepción del pedido, comenzando en ese momento el plazo de entrega en caso de que resultase aplicable. Si en un plazo de 24 horas no ha recibido el email de confirmación, el Cliente deberá ponerse en contacto inmediatamente con CATEB llamando al teléfono de contacto 93 240 20 60 o enviando un email a consultoriatecnica@cateb.cat.\n\nSi durante el proceso de compra de cualquiera de nuestros productos o servicios ha introducido erróneamente algún dato, deberá ponerse en contacto inmediatamente con nosotros a través del teléfono de contacto 93 240 20 60 o enviando un email a consultoriatecnica@cateb.cat.'
        },
        {
          id: '3.4',
          title: '3.4. Manifestaciones formales del Cliente',
          content: 'Mediante la adquisición de los servicios el Usuario y/o Cliente, declara:\n\n– Que es una persona mayor de edad y con capacidad para contratar.\n\n– Que ha leído, comprendido y acepta las presentes Condiciones Generales de Contratación y demás normativa aplicable a la contratación de CATEB.'
        }
      ]
    },
    {
      id: '4',
      title: '4. Información sobre los Productos y Servicios digitales',
      content: 'Las características de los productos, descripción técnica y funcionalidades se encuentran a disposición de los clientes en www.libroedificiodigital.es.\n\nCATEB se reserva el derecho a realizar modificaciones en su catálogo de productos respetando en todo momento las normas que resulten de aplicación.\n\nCATEB pone a disposición del Usuario y/o Cliente los siguientes productos y servicios:\n\n– Aplicaciones informáticas mediante pago único o suscripción.\n\nEn nuestra web el Usuario y/o Cliente podrá encontrar las características y condiciones de cada producto y/o servicio en las que se le informará de las modalidades de acceso, coste, duración, contenidos, requisitos técnicos o compatibilidad con otros softwares y más información que puede resultar de interés para el Usuario y/o Cliente.\n\nEs posible que algunas de nuestras aplicaciones requieran autenticación para utilizarlas, correspondiéndose con las credenciales del alta como usuario. Adicionalmente, algunas de nuestras aplicaciones solicitan la introducción de otros datos personales -propios o de terceros- para prestar las funcionalidades requeridas. Usted tendrá que tener permiso de estos terceros para introducir sus datos.'
    },
    {
      id: '5',
      title: '5. Condiciones económicas',
      content: 'El precio (Precio de Venta al Público o PVP) se encuentra disponible en la descripción de cada producto, está expresado en euros e incluye el IVA y/o cualquier otro impuesto o tasa que resultase de aplicación.\n\nVerificado el pago, se procederá a la puesta a disposición de los productos o servicios conforme se detalla en la cláusula 3 de estas condiciones.\n\nLas formas de pago admitidas son las siguientes:\n\n(1) Tarjeta bancaria. El cargo se realiza en tiempo real, a través de la pasarela de pago segura Redsys y una vez se haya comprobado que los datos comunicados son correctos.\n\n(2) Cargo en cuenta. Para aquellos usuarios que sean miembros del CATEB el pago podrá realizarse mediante cargo en cuenta bancaria que tengan autorizados los cargos del CATEB.'
    },
    {
      id: '6',
      title: '6. Garantía Legal',
      content: 'De conformidad con aquello dispuesto en el RDL 1/2007 de 16 de noviembre, por el que se aprueba el "Texto Refundido de los Consumidores y Usuarios y otras leyes complementarias", el cliente, dispondrá de un período de dos años de garantía en los productos para manifestar su falta de conformidad, excepto cuando la falta de conformidad sea incompatible con la naturaleza del producto o la índole de la falta de conformidad.'
    },
     {
       id: '7',
       title: '7. Desistimiento, devoluciones e incidencias',
       content: 'El cliente dispondrá de la facultad de desistimiento de su compra, notificándolo al CATEB en el plazo de 14 días naturales desde el acceso al contenido digital, excepto en los casos previstos al "RDL 1/2007, de 16 de noviembre de la Ley General para la Defensa de los Consumidoras y Usuarios y otras leyes complementarias".\n\nModelo de formulario de desistimiento.'
     },
    {
      id: '8',
      title: '8. Responsabilidades',
      content: 'El Cliente deberá cumplir con las manifestaciones formales indicadas en la cláusula 3 de estas condiciones.\n\nEl Cliente garantiza la veracidad y exactitud de los datos facilitados al rellenar los formularios de alta como usuario y de contratación, evitando la creación de perfiles o contrataciones que ocasionen perjuicios a CATEB como consecuencia de la incorrección de estos.\n\nEl Cliente debe abonar el precio indicado por adelantado utilizando las formas de pago indicadas en las presentes condiciones.\n\nEl Cliente debe hacer un uso diligente de los productos y servicios ofrecidos por CATEB obligándose a usar los productos y servicios ofrecidos en el sitio web de forma lícita y sin contravenir la legislación vigente ni lesionar los derechos e intereses de terceras personas.'
    },
    {
      id: '9',
      title: '9. Vigencia del contrato',
      content: 'El periodo de vigencia del contrato se inicia con la compra del producto y finaliza en el momento del cierre del producto o, en el caso de los productos de gestión mientras dure la suscripción.\n\nEn el caso de adquirir el producto de gestión, la suscripción tendrá carácter anual y se renovará tácitamente a su vencimiento.\n\nEn todo caso, el CATEB se reserva el derecho a suspender el servicio con carácter definitivo, con un aviso previo de 2 meses, durante los cuales el cliente podrá descargar su información.'
    },
    {
      id: '10',
      title: '10. Propiedad intelectual e industrial',
      content: 'El titular de todo el software disponible y de sus actualizaciones de mejora, rendimiento o seguridad es CATEB, sus licenciatarios, empresas asociadas u otros proveedores que hayan podido proporcionar materiales para el desarrollo y diseño de los productos y servicios.\n\nSe prohíbe expresamente, salvo autorización por escrito y expresa de CATEB, la reproducción, transformación, distribución, comunicación pública, puesta a disposición al público, venta u otros usos distintos a los expresamente autorizados por CATEB en las presentes condiciones.'
    },
    {
      id: '11',
      title: '11. Atención al Cliente y Reclamaciones',
      content: 'Los Clientes podrán contactar y presentar sus reclamaciones llamando al teléfono de contacto 93 240 20 60 o enviando un email a consultoriatecnica@cateb.cat. El horario de atención al cliente será de Lunes a Viernes de 9:00 a 14:00.'
    },
    {
      id: '12',
      title: '12. Hojas de Reclamación',
      content: 'Se ponen hojas de reclamación a disposición del consumidor en: https://consum.gencat.cat/web/.content/50_RECOMANACIONS/nadal/doc_59629304_1.pdf'
    },
    {
      id: '13',
      title: '13. Legislación Aplicable y Jurisdicción competente',
      content: 'Este contrato se rige por la Ley Española. Para los casos que la normativa prevea la posibilidad de que las partes se sometan a un fuero, se someten a los Jueces y Tribunales de la Ciudad de Barcelona (España), con renuncia expresa de cualquier otro al que pudiera corresponderles.'
    }
  ];

  const renderSection = (section: any) => {
    const hasSubsections = section.subsections && section.subsections.length > 0;
    const isSectionExpanded = isExpanded(section.id);

    return (
      <View key={section.id} style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(section.id)}
        >
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Ionicons
            name={isSectionExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>

        {isSectionExpanded && (
          <View style={styles.sectionContent}>
            {hasSubsections ? (
              section.subsections.map((subsection: any) => (
                <View key={subsection.id} style={styles.subsection}>
                  <Text style={styles.subsectionTitle}>{subsection.title}</Text>
                  <Text style={styles.subsectionContent}>{renderTextWithLinks(subsection.content)}</Text>
                </View>
              ))
             ) : (
               <Text style={styles.sectionText}>{renderTextWithLinks(section.content)}</Text>
             )}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Condiciones generales de contratación productos LED</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {sections.map(renderSection)}
          </ScrollView>

          {/* Download Button */}
          <View style={styles.downloadContainer}>
            <TouchableOpacity 
              style={styles.downloadButton} 
              onPress={() => {
                Linking.openURL('https://onedrive.live.com/personal/f4477f79fcb59fe8/_layouts/15/Doc.aspx?sourcedoc=%7B09dbc52c-ec9a-4204-a121-2ef8c427876a%7D&action=default&redeem=aHR0cHM6Ly8xZHJ2Lm1zL3cvYy9mNDQ3N2Y3OWZjYjU5ZmU4L0VTekYyd21hN0FSQ29TRXUtTVFuaDJvQmpOeFRkd0lVd0JaRzl3NHFsYjQzZmc_ZT1ZbDJ5NGI&slrid=4be3d1a1-0019-a000-8cf3-82dc8071e290&originalPath=aHR0cHM6Ly8xZHJ2Lm1zL3cvYy9mNDQ3N2Y3OWZjYjU5ZmU4L0VTekYyd21hN0FSQ29TRXUtTVFuaDJvQmpOeFRkd0lVd0JaRzl3NHFsYjQzZmc_cnRpbWU9TmM2YTZtc1Iza2c&CID=027e9569-61ad-4737-a36e-0086c15331fc&_SRM=0:G:121');
              }}
            >
              <Ionicons name="document-text" size={20} color={colors.white} />
              <Text style={styles.downloadButtonText}>{t('downloadTerms', 'auth')}</Text>
            </TouchableOpacity>
          </View>

               {/* Action Buttons */}
               <View style={styles.actionButtonsContainer}>
                 <TouchableOpacity style={styles.rejectButton} onPress={onReject || (() => {})}>
                   <Text style={styles.rejectButtonText}>{t('reject', 'auth')}</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.acceptButton} onPress={onAccept || (() => {})}>
                   <Text style={styles.acceptButtonText}>{t('accept', 'auth')}</Text>
                 </TouchableOpacity>
               </View>
        </View>
      </View>
    </Modal>
  );
};
