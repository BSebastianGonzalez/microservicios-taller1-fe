import React from "react";
import { useParams, Link } from "react-router-dom";
import Button from "../../../components/Button";

// Copia el array de leyes aquí o impórtalo si lo tienes en un archivo aparte
const laws = [
  {
      id: 1,
      name: "Constitución Política de Colombia - Artículo 20",
      description:
        "Garantiza la libertad de expresión y el derecho a informar y recibir información veraz e imparcial. Fundamenta la posibilidad de realizar denuncias de manera libre, incluso de forma anónima.",
    },
    {
      id: 2,
      name: "Constitución Política de Colombia - Artículo 23",
      description:
        "Reconoce el derecho de toda persona a presentar peticiones respetuosas a las autoridades y a obtener pronta respuesta. Este artículo respalda el uso de canales de denuncia, incluidos los digitales.",
    },
    {
      id: 3,
      name: "Constitución Política de Colombia - Artículo 74",
      description:
        "Establece el derecho de acceso a documentos públicos y promueve la participación ciudadana en la vigilancia de la gestión pública, incluidos entornos como el universitario.",
    },
    {
      id: 4,
      name: "Ley 1755 de 2015 - Derecho de Petición",
      description:
        "Regula el derecho fundamental de petición en sus diferentes modalidades: quejas, reclamos, denuncias, sugerencias y consultas. Aplica tanto a entidades públicas como privadas que presten funciones públicas, como las universidades estatales.",
    },
    {
      id: 5,
      name: "Ley 1757 de 2015 - Participación Ciudadana",
      description:
        "Promueve mecanismos de control social y participación en la gestión pública, incluyendo veedurías ciudadanas, observatorios y otras formas de vigilancia ciudadana.",
    },
    {
      id: 6,
      name: "Ley 1712 de 2014 - Ley de Transparencia y del Derecho de Acceso a la Información Pública",
      description:
        "Garantiza el acceso libre a la información pública, bajo el principio de máxima divulgación. Obliga a entidades públicas (y privadas que presten servicios públicos) a facilitar información sin restricciones indebidas.",
    },
    {
      id: 7,
      name: "Decreto 1081 de 2015",
      description:
        "Reglamenta parcialmente la Ley 1712 de 2014, estableciendo procedimientos, plazos y criterios para la entrega y publicación de información pública.",
    },
    {
      id: 8,
      name: "Ley 1581 de 2012 - Ley de Protección de Datos Personales",
      description:
        "Establece principios y normas para el tratamiento de datos personales, garantizando el derecho a la privacidad, el consentimiento informado y el anonimato, fundamentales para plataformas de denuncias anónimas.",
    },
    {
      id: 9,
      name: "Decreto 1377 de 2013",
      description:
        "Reglamenta parcialmente la Ley 1581 de 2012, estableciendo lineamientos sobre el manejo, seguridad y confidencialidad de los datos personales recolectados por las entidades.",
    },
    {
      id: 10,
      name: "Ley 1474 de 2011 - Estatuto Anticorrupción",
      description:
        "Incluye disposiciones para la protección de informantes en casos de corrupción, garantizando la reserva de identidad y evitando represalias. Es un respaldo legal clave para plataformas de denuncias anónimas.",
    },
    {
      id: 11,
      name: "Ley 1621 de 2013 - Ley de Inteligencia y Contrainteligencia",
      description:
        "Aunque dirigida a organismos de seguridad, establece principios de confidencialidad que pueden aplicarse a sistemas de denuncia internos para proteger la identidad de los denunciantes.",
    },
    {
      id: 12,
      name: "Ley 30 de 1992 - Ley de Educación Superior",
      description:
        "Reconoce la autonomía universitaria para crear reglamentos internos, incluyendo mecanismos de convivencia y denuncia. Facilita la adopción de plataformas digitales de denuncia dentro del marco institucional.",
    },
    {
      id: 13,
      name: "Ley 1010 de 2006 - Ley de Acoso Laboral",
      description:
        "Establece mecanismos para prevenir, corregir y sancionar el acoso laboral, incluyendo la protección de los denunciantes. Aplica a entornos laborales, incluyendo instituciones educativas, y respalda la implementación de canales de denuncia confidenciales.",
    },
    {
      id: 14,
      name: "Ley 1257 de 2008 - Ley de Violencia contra la Mujer",
      description:
        "Define y sanciona diversas formas de violencia contra las mujeres, incluyendo la violencia psicológica y sexual. Promueve la creación de mecanismos de denuncia seguros y confidenciales en instituciones, como las universidades.",
    },
    {
      id: 15,
      name: "Ley 1098 de 2006 - Código de Infancia y Adolescencia",
      description:
        "Establece normas para la protección integral de niños, niñas y adolescentes, incluyendo el derecho a la intimidad y a la protección contra toda forma de violencia. Relevante para universidades con estudiantes menores de edad.",
    },
    {
      id: 16,
      name: "Ley 1908 de 2018 - Ley de Fortalecimiento de la Investigación y Judicialización de Organizaciones Criminales",
      description:
        "Fortalece los mecanismos de investigación y judicialización de organizaciones criminales, incluyendo medidas para proteger a los denunciantes y testigos, lo cual es aplicable en contextos universitarios donde se denuncien actividades ilícitas.",
    },
    {
      id: 17,
      name: "Ley 906 de 2004 - Código de Procedimiento Penal",
      description:
        "Establece el procedimiento penal en Colombia, incluyendo medidas de protección para víctimas y testigos. El artículo 342 contempla la adopción de medidas necesarias para ofrecer eficaz protección a víctimas y testigos, lo cual respalda la confidencialidad en las denuncias.",
    },{
      id: 1,
      name: "Constitución Política de Colombia - Artículo 20",
      description:
        "Garantiza la libertad de expresión y el derecho a informar y recibir información veraz e imparcial. Fundamenta la posibilidad de realizar denuncias de manera libre, incluso de forma anónima.",
    },
    {
      id: 2,
      name: "Constitución Política de Colombia - Artículo 23",
      description:
        "Reconoce el derecho de toda persona a presentar peticiones respetuosas a las autoridades y a obtener pronta respuesta. Este artículo respalda el uso de canales de denuncia, incluidos los digitales.",
    },
    {
      id: 3,
      name: "Constitución Política de Colombia - Artículo 74",
      description:
        "Establece el derecho de acceso a documentos públicos y promueve la participación ciudadana en la vigilancia de la gestión pública, incluidos entornos como el universitario.",
    },
    {
      id: 4,
      name: "Ley 1755 de 2015 - Derecho de Petición",
      description:
        "Regula el derecho fundamental de petición en sus diferentes modalidades: quejas, reclamos, denuncias, sugerencias y consultas. Aplica tanto a entidades públicas como privadas que presten funciones públicas, como las universidades estatales.",
    },
    {
      id: 5,
      name: "Ley 1757 de 2015 - Participación Ciudadana",
      description:
        "Promueve mecanismos de control social y participación en la gestión pública, incluyendo veedurías ciudadanas, observatorios y otras formas de vigilancia ciudadana.",
    },
    {
      id: 6,
      name: "Ley 1712 de 2014 - Ley de Transparencia y del Derecho de Acceso a la Información Pública",
      description:
        "Garantiza el acceso libre a la información pública, bajo el principio de máxima divulgación. Obliga a entidades públicas (y privadas que presten servicios públicos) a facilitar información sin restricciones indebidas.",
    },
    {
      id: 7,
      name: "Decreto 1081 de 2015",
      description:
        "Reglamenta parcialmente la Ley 1712 de 2014, estableciendo procedimientos, plazos y criterios para la entrega y publicación de información pública.",
    },
    {
      id: 8,
      name: "Ley 1581 de 2012 - Ley de Protección de Datos Personales",
      description:
        "Establece principios y normas para el tratamiento de datos personales, garantizando el derecho a la privacidad, el consentimiento informado y el anonimato, fundamentales para plataformas de denuncias anónimas.",
    },
    {
      id: 9,
      name: "Decreto 1377 de 2013",
      description:
        "Reglamenta parcialmente la Ley 1581 de 2012, estableciendo lineamientos sobre el manejo, seguridad y confidencialidad de los datos personales recolectados por las entidades.",
    },
    {
      id: 10,
      name: "Ley 1474 de 2011 - Estatuto Anticorrupción",
      description:
        "Incluye disposiciones para la protección de informantes en casos de corrupción, garantizando la reserva de identidad y evitando represalias. Es un respaldo legal clave para plataformas de denuncias anónimas.",
    },
    {
      id: 11,
      name: "Ley 1621 de 2013 - Ley de Inteligencia y Contrainteligencia",
      description:
        "Aunque dirigida a organismos de seguridad, establece principios de confidencialidad que pueden aplicarse a sistemas de denuncia internos para proteger la identidad de los denunciantes.",
    },
    {
      id: 12,
      name: "Ley 30 de 1992 - Ley de Educación Superior",
      description:
        "Reconoce la autonomía universitaria para crear reglamentos internos, incluyendo mecanismos de convivencia y denuncia. Facilita la adopción de plataformas digitales de denuncia dentro del marco institucional.",
    },
    {
      id: 13,
      name: "Ley 1010 de 2006 - Ley de Acoso Laboral",
      description:
        "Establece mecanismos para prevenir, corregir y sancionar el acoso laboral, incluyendo la protección de los denunciantes. Aplica a entornos laborales, incluyendo instituciones educativas, y respalda la implementación de canales de denuncia confidenciales.",
    },
    {
      id: 14,
      name: "Ley 1257 de 2008 - Ley de Violencia contra la Mujer",
      description:
        "Define y sanciona diversas formas de violencia contra las mujeres, incluyendo la violencia psicológica y sexual. Promueve la creación de mecanismos de denuncia seguros y confidenciales en instituciones, como las universidades.",
    },
    {
      id: 15,
      name: "Ley 1098 de 2006 - Código de Infancia y Adolescencia",
      description:
        "Establece normas para la protección integral de niños, niñas y adolescentes, incluyendo el derecho a la intimidad y a la protección contra toda forma de violencia. Relevante para universidades con estudiantes menores de edad.",
    },
    {
      id: 16,
      name: "Ley 1908 de 2018 - Ley de Fortalecimiento de la Investigación y Judicialización de Organizaciones Criminales",
      description:
        "Fortalece los mecanismos de investigación y judicialización de organizaciones criminales, incluyendo medidas para proteger a los denunciantes y testigos, lo cual es aplicable en contextos universitarios donde se denuncien actividades ilícitas.",
    },
    {
      id: 17,
      name: "Ley 906 de 2004 - Código de Procedimiento Penal",
      description:
        "Establece el procedimiento penal en Colombia, incluyendo medidas de protección para víctimas y testigos. El artículo 342 contempla la adopción de medidas necesarias para ofrecer eficaz protección a víctimas y testigos, lo cual respalda la confidencialidad en las denuncias.",
    },
];


const LawView = () => {
  const { id } = useParams();
  const law = laws.find((l) => l.id === Number(id));

  if (!law) {
    return (
      <div style={styles.mainContainer}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Ley no encontrada</h2>
          </div>
          <div style={styles.cardBody}>
            <p style={styles.cardText}>No se encontró la ley solicitada.</p>
            <Link to="/legal-list">
              <Button text="Volver" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.mainContainer}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h1 style={styles.cardTitle}>{law.name}</h1>
        </div>
        <div style={styles.cardBody}>
          <p style={styles.cardText}>{law.description}</p>
        </div>
      </div>
      <div style={styles.volverContainer}>
        <Link to="/law_frame">
          <Button text="Volver" />
        </Link>
      </div>
    </div>
  );
};

const styles = {
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
  },
  card: {
    background: "#fff",
    borderRadius: "1rem",
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    maxWidth: "42rem",
    width: "100%",
  },
  cardHeader: {
    background: "#000",
    borderTopLeftRadius: "1rem",
    borderTopRightRadius: "1rem",
    padding: "1.5rem 1.5rem",
  },
  cardTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    margin: 0,
  },
  cardBody: {
    padding: "1.5rem 1.5rem",
  },
  cardText: {
    fontSize: "1.125rem",
    marginBottom: "1.5rem",
  },
  volverContainer: {
    marginTop: "1.5rem",
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
};

export default LawView;