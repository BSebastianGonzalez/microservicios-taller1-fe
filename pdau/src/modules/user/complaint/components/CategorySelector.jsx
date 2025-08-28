import React, { useState, useEffect, useRef } from "react";

const CategorySelector = ({ categories, onSelect }) => {
  const [search, setSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);

  // Asegurar que categories sea un array
  const safeCategories = Array.isArray(categories) ? categories : [];

  useEffect(() => {
    console.log("CategorySelector received categories:", categories); // Debug log
    
    // Filtrar categorías solo si categories es un array válido
    if (Array.isArray(safeCategories)) {
      setFilteredCategories(
        safeCategories.filter(
          (category) =>
            category.nombre.toLowerCase().includes(search.toLowerCase()) &&
            !selectedCategories.some((selected) => selected.id === category.id)
        )
      );
    } else {
      setFilteredCategories([]);
    }
  }, [search, safeCategories, selectedCategories]);

  const handleSelect = (category) => {
    if (!selectedCategories.some((selected) => selected.id === category.id)) {
      const updatedCategories = [...selectedCategories, category];
      setSelectedCategories(updatedCategories);
      onSelect(updatedCategories);
      setError("");
    }
    setSearch("");
    setIsOpen(false);
  };

  const handleRemove = (category) => {
    const updatedCategories = selectedCategories.filter(
      (item) => item.id !== category.id
    );
    setSelectedCategories(updatedCategories);
    onSelect(updatedCategories);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (selectedCategories.length === 0) {
          setError("Se debe seleccionar al menos una categoría");
        }
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedCategories]);

  const styles = {
    container: {
      position: 'relative',
      width: '100%',
    },
    selectedTags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginBottom: '0.5rem',
    },
    tag: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#e5e7eb',
      color: '#1f2937',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.375rem',
    },
    removeButton: {
      marginLeft: '0.5rem',
      color: '#ef4444',
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      fontSize: '1rem',
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      outline: 'none',
      fontSize: '0.875rem',
    },
    dropdown: {
      position: 'absolute',
      zIndex: 10,
      backgroundColor: 'white',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      marginTop: '0.25rem',
      width: '100%',
      maxHeight: '10rem',
      overflowY: 'auto',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    dropdownItem: {
      padding: '0.5rem',
      cursor: 'pointer',
      borderBottom: '1px solid #f3f4f6',
    },
    dropdownItemHover: {
      backgroundColor: '#f3f4f6',
    },
    noResults: {
      padding: '0.5rem',
      color: '#6b7280',
    },
    error: {
      color: '#ef4444',
      fontSize: '0.875rem',
      marginTop: '0.5rem',
    },
    debug: {
      backgroundColor: '#fef3c7',
      border: '1px solid #f59e0b',
      padding: '0.5rem',
      borderRadius: '0.375rem',
      marginBottom: '0.5rem',
      fontSize: '0.75rem',
    }
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      {/* Debug info */}
      <div style={styles.debug}>
        <strong>Debug:</strong> categories = {JSON.stringify(categories)}<br/>
        <strong>Type:</strong> {typeof categories}<br/>
        <strong>Is Array:</strong> {Array.isArray(categories).toString()}<br/>
        <strong>Length:</strong> {Array.isArray(categories) ? categories.length : 'N/A'}
      </div>

      <div style={styles.selectedTags}>
        {selectedCategories.map((category) => (
          <div key={category.id} style={styles.tag}>
            <span>{category.nombre}</span>
            <button
              onClick={() => handleRemove(category)}
              style={styles.removeButton}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Selecciona una categoría"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsOpen(true)}
        style={styles.input}
      />
      {isOpen && (
        <ul style={styles.dropdown}>
          {filteredCategories.map((category) => (
            <li
              key={category.id}
              onClick={() => handleSelect(category)}
              style={styles.dropdownItem}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              {category.nombre}
            </li>
          ))}
          {filteredCategories.length === 0 && (
            <li style={styles.noResults}>No se encontraron categorías</li>
          )}
        </ul>
      )}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

export default CategorySelector;