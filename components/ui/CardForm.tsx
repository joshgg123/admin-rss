"use client";
import React, { useState, useEffect } from 'react';
import { CardData } from '../../types/carrusel';

interface CardFormProps {
  initialData?: CardData;
  onSave: (card: CardData) => void;
  onCancel: () => void;
}

const cardFormStyles: Record<string, React.CSSProperties> = {
  formContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
    marginTop: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    display: 'block',
    fontSize: '0.9em',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1em',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1em',
    boxSizing: 'border-box',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  button: {
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1em',
    border: 'none',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    color: 'white',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    color: '#333',
  },
};

export const CardForm: React.FC<CardFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<CardData>(() => {
    if (initialData?.type === 'newsletter') {
      return {
        id: initialData.id || '',
        type: 'newsletter',
        title: initialData.title || '',
        imageUrl: initialData.imageUrl || '',
        link: initialData.link || '',
        content: (initialData as any).content || '',
      };
    }
    // Default to youtube card
    return {
      id: initialData?.id || '',
      type: 'youtube',
      title: initialData?.title || '',
      imageUrl: initialData?.imageUrl || '',
      link: initialData?.link || '',
    };
  });

  useEffect(() => {
    if (formData.type !== 'youtube') {
      setFormData(prev => ({ ...prev, link: '' }));
    }
  }, [formData.type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cardToSave: CardData = {
      ...formData,
      title: formData.title || '',
      imageUrl: formData.imageUrl || '',
      link: formData.type === 'youtube' ? formData.link || '' : '',
    };
    onSave(cardToSave);
  };

  return (
    <div style={cardFormStyles.formContainer}>
      <h3>{initialData ? 'Editar Tarjeta' : 'Agregar Nueva Tarjeta'}</h3>
      <form onSubmit={handleSubmit}>
        <div style={cardFormStyles.formGroup}>
          <label style={cardFormStyles.label}>Tipo de Tarjeta:</label>
          <select name="type" value={formData.type} onChange={handleChange} style={cardFormStyles.select}>
            <option value="youtube">YouTube</option>
            <option value="newsletter">Newsletter</option>
          </select>
        </div>
        <div style={cardFormStyles.formGroup}>
          <label style={cardFormStyles.label}>Título:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} style={cardFormStyles.input} required />
        </div>
        <div style={cardFormStyles.formGroup}>
          <label style={cardFormStyles.label}>URL de la Imagen:</label>
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} style={cardFormStyles.input} required />
        </div>
        
        {formData.type === 'youtube' && (
          <div style={cardFormStyles.formGroup}>
            <label style={cardFormStyles.label}>URL del Video:</label>
            <input type="text" name="link" value={formData.link ?? ''} onChange={handleChange} style={cardFormStyles.input} required />
          </div>
        )}

        <div style={cardFormStyles.buttonGroup}>
          <button type="submit" style={{ ...cardFormStyles.button, ...cardFormStyles.saveButton }}>Guardar</button>
          <button type="button" onClick={onCancel} style={{ ...cardFormStyles.button, ...cardFormStyles.cancelButton }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};