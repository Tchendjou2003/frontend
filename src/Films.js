import React, { useEffect, useState } from 'react';

const API_URL = 'http://127.0.0.1:8000/api/';

const EMPTY_FILM_DATA = {
  id: null,
  title: '',
  length: '',
  year: '',
  score: '',
  genre: '',
};

function Films() {
  const [films, setFilms] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FILM_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Charger les films
  const fetchFilms = () => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur API (${res.status})`);
        return res.json();
      })
      .then((data) => setFilms(data))
      .catch((err) => console.error('Erreur chargement films:', err));
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData(EMPTY_FILM_DATA);
    setIsEditing(false);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL}${formData.id}/` : API_URL;

    const payload = {
      ...formData,
      length: formData.length ? parseInt(formData.length, 10) : null,
      year: formData.year ? parseInt(formData.year, 10) : null,
      score: formData.score ? parseFloat(formData.score) : null,
      genre: formData.genre ? parseInt(formData.genre, 10) : null,
    };

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur API (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (isEditing) {
          setFilms((prev) => prev.map((f) => (f.id === data.id ? data : f)));
        } else {
          setFilms((prev) => [...prev, data]);
        }
        resetForm();
      })
      .catch((err) => console.error('Erreur enregistrement:', err));
  };

  const handleEdit = (film) => {
    setFormData(film);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCreate = () => {
    setFormData(EMPTY_FILM_DATA);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Supprimer ce film ?')) {
      fetch(`${API_URL}${id}/`, { method: 'DELETE' })
        .then((res) => {
          if (!res.ok) throw new Error(`Erreur API (${res.status})`);
          setFilms((prev) => prev.filter((f) => f.id !== id));
        })
        .catch((err) => console.error('Erreur suppression:', err));
    }
  };

  // --- Styles ---
  const styles = {
    container: { 
      minHeight: '100vh',
      background: 'white',

      padding: '40px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    wrapper: { maxWidth: '1200px', margin: '0 auto' },
    header: { textAlign: 'center', color: 'white', marginBottom: '40px', fontSize: '2.5rem', fontWeight: 'bold' },
    tableCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '30px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      overflowX: 'auto'
    },
    button: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '600',
      color: 'white',
      background: 'black',
      marginBottom: '20px'
    },
    tableHeader: { background: '#2a5298', color: 'white' },
    tableHeaderCell: { padding: '12px', textAlign: 'left', fontWeight: '600' },
    tableCell: { padding: '12px', borderBottom: '1px solid #eee' },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    formCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '30px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      position: 'relative'
    },
    input: { padding: '10px', border: '1px solid #ccc', borderRadius: '6px', width: '100%' },
    formGroup: { marginBottom: '15px', display: 'flex', flexDirection: 'column' },
    actionButton: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      marginRight: '8px'
    },
    editButton: { backgroundColor: '#ffc107', color: '#000' },
    deleteButton: { backgroundColor: '#dc3545', color: 'white' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Bouton Créer */}
       
        {/* Tableau */}
        {/* Tableau */}
<div style={styles.tableCard}>
  <h2>📋 Liste des films</h2>
  {films.length === 0 ? (
    <p>Aucun film pour le moment.</p>
  ) : (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead style={styles.tableHeader}>
        <tr>
          <th style={styles.tableHeaderCell}>Titre</th>
          <th style={styles.tableHeaderCell}>Durée</th>
          <th style={styles.tableHeaderCell}>Année</th>
          <th style={styles.tableHeaderCell}>Score</th>
          <th style={styles.tableHeaderCell}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {films.map((film) => (
          <tr key={film.id}>
            <td style={styles.tableCell}>{film.title}</td>
            <td style={styles.tableCell}>{film.length || '—'}</td>
            <td style={styles.tableCell}>{film.year || '—'}</td>
            <td style={styles.tableCell}>{film.score || '—'}</td>
            <td style={styles.tableCell}>
              <button
                onClick={() => handleEdit(film)}
                style={{ ...styles.actionButton, ...styles.editButton }}
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(film.id)}
                style={{ ...styles.actionButton, ...styles.deleteButton }}
              >
                Supprimer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

{/* Bouton Créer en bas, centré */}
<div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
  <button onClick={handleCreate} style={styles.button}>
    ➕ Créer un film
  </button>
</div>



        {/* Modal Popup du formulaire */}
        {showForm && (
          <div style={styles.modalOverlay} onClick={resetForm}>
            <div style={styles.formCard} onClick={(e) => e.stopPropagation()}>
              <h2>{isEditing ? ' Modifier le film' : ' Créer un film'}</h2>
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label>Titre</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Durée (min)</label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length || ''}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Année</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year || ''}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Score</label>
                  <input
                    type="number"
                    step="0.1"
                    name="score"
                    value={formData.score || ''}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button
                    type="submit"
                    style={{ ...styles.button, flex: 1, margin: 0 }}
                  >
                    {isEditing ? ' Mettre à jour' : ' Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{ ...styles.button, background: '#6c757d', flex: 1, margin: 0 }}
                  >
                     Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Films;