import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ComplaintService from "../../../../services/ComplaintService";
import ListContainer from "../../../../components/ListContainer";
import Tag from "../../../../components/Tag";

const ArchivedSection = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedDepartamentoId, setSelectedDepartamentoId] = useState("");
  const [selectedDepartamentoName, setSelectedDepartamentoName] = useState("");
  const [selectedEstadoId, setSelectedEstadoId] = useState("");
  const [selectedEstadoName, setSelectedEstadoName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const complaintsData = await ComplaintService.getArchivedComplaints();
        const categoriesData = await ComplaintService.getAllCategories();
        const departamentosData = await ComplaintService.getAllDepartamentos();
        const estadosData = await ComplaintService.getEstados
          ? await ComplaintService.getEstados()
          : [];
        setComplaints(complaintsData);
        setFilteredComplaints(complaintsData);
        setCategories(categoriesData);
        setDepartamentos(departamentosData);
        setEstados(estadosData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const toggleFilterModal = () => {
    if (!isFilterModalOpen) {
      setShowModal(true);
      setTimeout(() => setIsFilterModalOpen(true), 10);
    } else {
      setIsFilterModalOpen(false);
      setTimeout(() => setShowModal(false), 300);
    }
  };

  const applyFilters = async () => {
    try {
      let filtered = complaints;

      if (selectedDepartamentoId) {
        filtered = filtered.filter(
          (complaint) =>
            String(complaint.departamento?.id) === selectedDepartamentoId
        );
      }
      if (selectedCategoryId) {
        filtered = filtered.filter((complaint) =>
          complaint.categorias?.some((cat) => String(cat.id) === selectedCategoryId)
        );
      }
      if (selectedEstadoId) {
        filtered = filtered.filter((complaint) =>
          String(complaint.estado?.id) === selectedEstadoId
        );
      }
      if (keyword) {
        filtered = filtered.filter((complaint) =>
          complaint.titulo.toLowerCase().includes(keyword.toLowerCase())
        );
      }
      if (fechaInicio) {
        filtered = filtered.filter((complaint) =>
          complaint.fechaCreacion >= fechaInicio
        );
      }
      if (fechaFin) {
        filtered = filtered.filter((complaint) =>
          complaint.fechaCreacion <= fechaFin
        );
      }

      setFilteredComplaints(filtered);
      setCurrentPage(1);
      toggleFilterModal();
    } catch (error) {
      console.error("Error al aplicar filtros:", error);
    }
  };

  const clearCategoryFilter = () => {
    setSelectedCategoryId("");
    setSelectedCategoryName("");
    setFilteredComplaints(complaints);
  };

  const clearDepartamentoFilter = () => {
    setSelectedDepartamentoId("");
    setSelectedDepartamentoName("");
    setFilteredComplaints(complaints);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComplaints = filteredComplaints.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Denuncias archivadas
      </h1>

      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          {selectedCategoryName && (
            <Tag
              text={`Categoría: ${selectedCategoryName}`}
              onRemove={clearCategoryFilter}
            />
          )}
          {selectedDepartamentoName && (
            <Tag
              text={`Departamento: ${selectedDepartamentoName}`}
              onRemove={clearDepartamentoFilter}
            />
          )}
          {selectedEstadoName && (
            <Tag
              text={`Estado: ${selectedEstadoName}`}
              onRemove={() => {
                setSelectedEstadoId("");
                setSelectedEstadoName("");
                setFilteredComplaints(complaints);
              }}
            />
          )}
          {fechaInicio && (
            <Tag
              text={`Desde: ${fechaInicio}`}
              onRemove={() => setFechaInicio("")}
            />
          )}
          {fechaFin && (
            <Tag
              text={`Hasta: ${fechaFin}`}
              onRemove={() => setFechaFin("")}
            />
          )}
        </div>
        <button
          onClick={toggleFilterModal}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-black rounded-lg shadow hover:bg-gray-300"
        >
          <img src="img/filter.svg" alt="Filtro" className="w-5 h-5" />
          Aplicar filtros de búsqueda
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-white/10">
          <div
            className={`bg-white p-6 rounded-lg shadow-lg w-96 transition-all duration-300
              ${
                isFilterModalOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
          >
            <h2 className="text-2xl font-bold mb-4">Filtrar denuncias</h2>
            <div className="mb-4">
              <label
                htmlFor="department"
                className="block text-lg font-medium mb-2"
              >
                Departamento
              </label>
              <select
                id="department"
                value={selectedDepartamentoId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedName =
                    departamentos.find((dep) => String(dep.id) === selectedId)
                      ?.nombre || "";
                  setSelectedDepartamentoId(selectedId);
                  setSelectedDepartamentoName(selectedName);
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Todos los departamentos</option>
                {departamentos.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 overflow-visible">
              <label
                htmlFor="category"
                className="block text-lg font-medium mb-2"
              >
                Categoría
              </label>
              <select
                id="category"
                value={selectedCategoryId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedName =
                    categories.find((cat) => String(cat.id) === selectedId)
                      ?.nombre || "";
                  setSelectedCategoryId(selectedId);
                  setSelectedCategoryName(selectedName);
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="estado"
                className="block text-lg font-medium mb-2"
              >
                Estado
              </label>
              <select
                id="estado"
                value={selectedEstadoId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedName =
                    estados.find((est) => String(est.id) === selectedId)
                      ?.nombre || "";
                  setSelectedEstadoId(selectedId);
                  setSelectedEstadoName(selectedName);
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Todos los estados</option>
                {estados.map((estado) => (
                  <option key={estado.id} value={estado.id}>
                    {estado.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="keyword"
                className="block text-lg font-medium mb-2"
              >
                Palabras clave
              </label>
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Buscar por título"
              />
            </div>
            <div className="mb-4 flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="fecha-inicio"
                  className="block text-lg font-medium mb-2"
                >
                  Fecha desde
                </label>
                <input
                  id="fecha-inicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="fecha-fin"
                  className="block text-lg font-medium mb-2"
                >
                  Fecha hasta
                </label>
                <input
                  id="fecha-fin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={toggleFilterModal}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

      <ListContainer
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredComplaints.length}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      >
        <div className="overflow-hidden rounded-lg border border-gray-300 shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Título de denuncia</th>
                <th className="px-4 py-2 text-left">Fecha de realización</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 text-base-600 hover:underline cursor-pointer">
                    {complaint.titulo}
                  </td>
                  <td className="px-4 py-2">
                    {formatDate(complaint.fechaCreacion)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() =>
                        navigate("/archived_complaint", {
                          state: { complaintId: complaint.id },
                        })
                      }
                      className="flex items-center gap-2 text-base-600 hover:underline"
                    >
                      <img
                        src="img/check_complaint.svg"
                        alt="Revisar"
                        className="w-5 h-5"
                      />
                      Revisar denuncia
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ListContainer>
    </div>
  );
};

export default ArchivedSection;