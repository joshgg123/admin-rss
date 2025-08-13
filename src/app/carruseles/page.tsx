"use client";
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import db from '../../../lib/firebaseClient';
import { CarouselData, CarouselSaveData } from '../../../types/carrusel';
import { CarouselForm } from '../../../components/ui/carruselFrom';

// Estilos para la página de administración
const adminPageStyles: Record<string, React.CSSProperties> = {
  container: {
    padding: '30px',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  pageTitle: {
    fontSize: '2.5em',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#333',
    textAlign: 'center',
  },
  addButton: {
    padding: '12px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1em',
    marginBottom: '30px',
    display: 'block',
    margin: '0 auto 30px auto',
  },
  carouselList: {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  },
  carouselItem: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  carouselItemTitle: {
    fontSize: '1.5em',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#007AFF',
  },
  carouselItemCount: {
    fontSize: '0.9em',
    color: '#666',
    marginBottom: '15px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: 'auto',
  },
  actionButton: {
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9em',
    border: 'none',
  },
  editButton: {
    backgroundColor: '#007AFF',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
  },
  noCarouselsText: {
    textAlign: 'center',
    color: '#777',
    fontSize: '1.1em',
    marginTop: '50px',
    gridColumn: '1 / -1',
  },
  loadingContainer: {
    display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2em'
  },
  errorContainer: {
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2em', color: 'red'
  },
};

export default function AdminPage() {
  const [carousels, setCarousels] = useState<CarouselData[]>([]);
  const [editingCarousel, setEditingCarousel] = useState<CarouselData | null>(null);
  const [showCarouselForm, setShowCarouselForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carouselsCollection = collection(db, 'carousels');

  const fetchCarousels = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(carouselsCollection);
      const fetchedCarousels = querySnapshot.docs.map(docItem => ({
        ...docItem.data(),
        id: docItem.id
      })) as CarouselData[];
      setCarousels(fetchedCarousels);
    } catch (err) {
      console.error("Error al obtener los carruseles:", err);
      setError("Error al cargar los carruseles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarousels();
  }, []);

  const handleAddCarousel = () => {
    setEditingCarousel(null);
    setShowCarouselForm(true);
  };

  const handleEditCarousel = (carouselToEdit: CarouselData) => {
    setEditingCarousel(carouselToEdit);
    setShowCarouselForm(true);
  };

  const handleDeleteCarousel = async (carouselId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este carrusel y todo su contenido?')) {
      try {
        const carouselDoc = doc(db, 'carousels', carouselId);
        await deleteDoc(carouselDoc);
        fetchCarousels();
      } catch (err) {
        console.error("Error al eliminar el carrusel:", err);
        alert("Error al eliminar el carrusel.");
      }
    }
  };

  const handleCarouselFormSave = async (savedCarousel: CarouselSaveData) => {
    try {
      if (savedCarousel.id) {
        const { id, ...dataToUpdate } = savedCarousel;
        const carouselDoc = doc(db, 'carousels', id);
        await updateDoc(carouselDoc, dataToUpdate);
      } else {
        // Copia y elimina id si existe para evitar guardarlo en Firestore
        const dataToSave = { ...savedCarousel };
        delete (dataToSave).id;
        await addDoc(carouselsCollection, dataToSave);
      }
      fetchCarousels();
      setShowCarouselForm(false);
      setEditingCarousel(null);
    } catch (err) {
      console.error("Error al guardar el carrusel:", err);
      if (err instanceof Error) {
        alert(`Error al guardar el carrusel: ${err.message}`);
      } else {
        alert("Error al guardar el carrusel.");
      }
    }
  };

  const handleCarouselFormCancel = () => {
    setShowCarouselForm(false);
    setEditingCarousel(null);
  };

  if (loading) {
    return (
      <div style={adminPageStyles.loadingContainer}>
        <p>Cargando carruseles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={adminPageStyles.errorContainer}>
        <p>{error}</p>
        <button onClick={fetchCarousels}>Reintentar</button>
      </div>
    );
  }

  return (
    <div style={adminPageStyles.container}>
      <h1 style={adminPageStyles.pageTitle}>Administración de Carruseles</h1>

      {!showCarouselForm && (
        <>
          <button onClick={handleAddCarousel} style={adminPageStyles.addButton}>+ Agregar Nuevo Carrusel</button>
          <div style={adminPageStyles.carouselList}>
            {carousels.length === 0 ? (
              <p style={adminPageStyles.noCarouselsText}>No hay carruseles para administrar.</p>
            ) : (
              carousels.map(carousel => (
                <div key={carousel.id} style={adminPageStyles.carouselItem}>
                  <h3 style={adminPageStyles.carouselItemTitle}>
                    {carousel.title} ({carousel.id})
                  </h3>
                  <p style={adminPageStyles.carouselItemCount}>Tarjetas: {carousel.cards.length}</p>
                  <div style={adminPageStyles.buttonGroup}>
                    <button
                      onClick={() => handleEditCarousel(carousel)}
                      style={{ ...adminPageStyles.actionButton, ...adminPageStyles.editButton }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteCarousel(carousel.id)}
                      style={{ ...adminPageStyles.actionButton, ...adminPageStyles.deleteButton }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {showCarouselForm && (
        <CarouselForm
          initialData={editingCarousel || undefined}
          onSave={handleCarouselFormSave}
          onCancel={handleCarouselFormCancel}
        />
      )}
    </div>
  );
}
