import React, { useState } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cardAPI } from '../services/api';

const MultipleCardsUpload = ({ expansions, onCardsCreated, uploadToImgBB, toast }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]); // [{file, url, uploading, imageUrl, name, expansion_id, holo}]
  const [submitting, setSubmitting] = useState(false);

  const handleFilesChange = async (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(selected.map(file => ({
      file,
      url: URL.createObjectURL(file),
      uploading: true,
      imageUrl: '',
      name: '',
      expansion_id: '',
      holo: false
    })));
    // Upload tutte le immagini su ImgBB
    selected.forEach(async (file, idx) => {
      try {
        const imageUrl = await uploadToImgBB(file);
        setPreviews(prev => prev.map((p, i) => i === idx ? { ...p, uploading: false, imageUrl } : p));
      } catch (err) {
        setPreviews(prev => prev.map((p, i) => i === idx ? { ...p, uploading: false } : p));
        toast({ title: 'Errore upload ImgBB', description: err.message, variant: 'destructive' });
      }
    });
  };

  const handleFieldChange = (idx, field, value) => {
    setPreviews(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const validCards = previews.filter(p => p.imageUrl && p.name && p.expansion_id);
    const created = [];
    for (const card of validCards) {
      try {
        const data = await cardAPI.create({
          name: card.name,
          expansion_id: card.expansion_id,
          image: card.imageUrl,
          holo: card.holo
        });
        created.push(data);
      } catch (err) {
        toast({ title: 'Errore creazione carta', description: err.message, variant: 'destructive' });
      }
    }
    if (created.length > 0) {
      toast({ title: 'Carte create', description: `${created.length} carte create con successo!` });
      onCardsCreated(created);
      setFiles([]);
      setPreviews([]);
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input type="file" accept="image/*" multiple onChange={handleFilesChange} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {previews.map((p, idx) => (
          <div key={idx} className="bg-black/10 rounded-lg p-2 flex flex-col items-center">
            <div className="w-16 h-20 mb-2 relative">
              <img src={p.url} alt="preview" className="w-full h-full object-cover rounded border border-white/20" />
              {p.uploading && <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs text-white bg-black/60">Uploading...</span>}
            </div>
            <Input
              placeholder="Nome"
              value={p.name}
              onChange={e => handleFieldChange(idx, 'name', e.target.value)}
              className="mb-1 bg-white/10 border-white/20 text-white text-xs"
              required
            />
            <Select value={p.expansion_id} onValueChange={val => handleFieldChange(idx, 'expansion_id', val)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white text-xs">
                <SelectValue placeholder="Espansione" />
              </SelectTrigger>
              <SelectContent>
                {expansions.map((exp) => (
                  <SelectItem key={exp.id} value={exp.id}>{exp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label className="flex items-center mt-1 text-xs text-white">
              <input
                type="checkbox"
                checked={p.holo}
                onChange={e => handleFieldChange(idx, 'holo', e.target.checked)}
                className="mr-1"
              />
              Olografica
            </label>
          </div>
        ))}
      </div>
      {previews.length > 0 && (
        <Button type="submit" className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600" disabled={submitting}>
          Crea tutte le carte
        </Button>
      )}
    </form>
  );
};

export default MultipleCardsUpload;
