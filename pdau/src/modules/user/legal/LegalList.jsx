import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ListContainer from "../../../components/ListContainer";
import Button from "../../../components/Button";

const LegalList = () => {
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
    },
  ];

  const [filteredLaws, setFilteredLaws] = useState(laws);
  const [keyword, setKeyword] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1); 

  const navigate = useNavigate();

  const handleRowClick = (lawId) => {
    navigate(`/${lawId}`);
  };

  // Filtrado
  const handleFilter = (e) => {
    const keyword = e.target.value.toLowerCase();
    setKeyword(keyword);

    const filtered = laws.filter(
      (law) =>
        law.name.toLowerCase().includes(keyword) ||
        law.description.toLowerCase().includes(keyword)
    );

    setFilteredLaws(filtered);
    setCurrentPage(1); // 👉 Reiniciar página cuando se filtra
  };

  // Calcular el índice de inicio y fin
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLaws = filteredLaws.slice(startIndex, endIndex);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Listado de Leyes</h1>

      {/* Filtro y selector "Mostrar" en la misma fila */}
      <div style={styles.filterRow}>
        {/* Campo de búsqueda */}
        <input
          type="text"
          value={keyword}
          onChange={handleFilter}
          placeholder="Buscar por nombre o descripción"
          style={styles.input}
        />

        {/* Selector de elementos por página */}
        <div style={styles.selectContainer}>
          <label htmlFor="itemsPerPage" style={styles.label}>
            Mostrar:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // 👉 Reiniciar página
            }}
            style={styles.select}
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      <ListContainer
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredLaws.length}
        onPageChange={setCurrentPage}
      >
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={{...styles.th, width: "40%"}}>Nombre</th>
                <th style={{...styles.th, width: "60%"}}>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {currentLaws.map((law) => (
                <tr
                  key={law.id}
                  style={styles.tr}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor)}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = "")}
                  onClick={() => handleRowClick(law.id)}
                >
                  <td style={styles.tdName}>
                    {law.name}
                  </td>
                  <td style={styles.tdDesc}>
                    {law.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ListContainer>

      {/* Botón "Volver" */}
      <div style={styles.volverContainer}>
        <Link to="/">
          <Button
            text="Volver"
            // Puedes agregar estilos adicionales al botón si lo deseas
          />
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
  },
  title: {
    fontSize: "2.25rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  filterRow: {
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  input: {
    width: "100%",
    maxWidth: "28rem",
    padding: "0.5rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    outline: "none",
    fontSize: "1rem",
  },
  selectContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  label: {
    fontSize: "1.125rem",
    fontWeight: "500",
  },
  select: {
    padding: "0.5rem 0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    outline: "none",
    fontSize: "1rem",
  },
  tableContainer: {
    overflow: "hidden",
    borderRadius: "1rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    marginTop: "1rem",
    border: "0.5px solid rgb(0, 0, 0)",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
    tableLayout: "auto",
    backgroundColor: "#ffffff",
    //border: "0.5px solid rgb(0, 0, 0)",
  },
  thead: {
    backgroundColor: "#f8fafc",
    
  },
  th: {
    padding: "1rem 1.5rem",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "1.1rem",
    color: "#374151",
    border: "0.5px solid rgb(0, 0, 0)",
    //borderBottom: "1px solid rgb(0, 0, 0)",
    //borderRight: "1px solid rgb(0, 0, 0)",
  },
  tr: {
    cursor: "pointer",
    transition: "background 0.2s ease",
    border: "0.5px solid rgb(0, 0, 0)",
   // borderBottom: "1px solid rgb(0, 0, 0)",
   // borderRight: "1px solid rgb(0, 0, 0)",
  },
  trHover: {
    backgroundColor: "#f8fafc",
    border: "0.5px solid rgb(0, 0, 0)",
  },
  tdName: {
    padding: "1rem 1.5rem",
    fontWeight: "600",
    whiteSpace: "normal",
    wordWrap: "break-word",
    lineHeight: "1.5",
    color: "#1f2937",
    border: "0.5px solid rgb(0, 0, 0)",
   // borderRight: "1px solid rgb(0, 0, 0)",
    //borderBottom: "1px solid rgb(0, 0, 0)",
  },
  tdDesc: {
    padding: "1rem 1.5rem",
    whiteSpace: "normal",
    wordWrap: "break-word",
    lineHeight: "1.5",
    color: "#4b5563",
    border: "0.5px solid rgb(0, 0, 0)",
    borderBottom: "0px solid rgb(0, 0, 0)",
    borderRight: "1px solid rgb(0, 0, 0)",
  },
  volverContainer: {
    marginTop: "1.5rem",
    display: "flex",
    justifyContent: "flex-start",
  },
};

export default LegalList;
