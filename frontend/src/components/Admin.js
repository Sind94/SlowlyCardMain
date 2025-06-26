import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { expansionAPI, cardAPI, adminAPI } from '../services/api';
import MultipleCardsUpload from './MultipleCardsUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

const Admin = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [expansions, setExpansions] = useState([]);
  const [cards, setCards] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [expansionForm, setExpansionForm] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    image: '',
    published: false // Nuovo campo
  });
  const [cardForm, setCardForm] = useState({
    name: '',
    expansion_id: '',
    image: '',
    holo: false
  });
  const [editingExpansion, setEditingExpansion] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [selectedCardModal, setSelectedCardModal] = useState(null);

  // Check if user is admin
  const isAdmin = user?.is_admin;
  const imgurClientId = '546b1b1b1b1b1b1'; // Sostituisci con il tuo client ID Imgur se vuoi personalizzato
  const fileInputRef = useRef();

  const [cardImageUploading, setCardImageUploading] = useState(false);
  const [expansionImageUploading, setExpansionImageUploading] = useState(false);
  const [cardImageError, setCardImageError] = useState("");
  const [expansionImageError, setExpansionImageError] = useState("");

  // ImgBB API Key
  const imgbbApiKey = 'b36c1113deca7e64893ad97457a8d2e6';

  // Vista carte: griglia o elenco
  const [cardsViewMode, setCardsViewMode] = useState('grid');

  // Funzione generica upload ImgBB
  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || 'Errore upload ImgBB');
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Accesso negato",
        description: "Non hai i permessi per accedere a questa pagina",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [expansionsData, cardsData, usersData] = await Promise.all([
          expansionAPI.getAll(),
          cardAPI.getAll(),
          adminAPI.getUsers()
        ]);
        setExpansions(expansionsData);
        setCards(cardsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dati",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, navigate, toast]);

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-white/20 border-t-white rounded-full"></div>
      </div>
    );
  }

  const handleExpansionSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingExpansion) {
        // Update existing expansion
        const updated = await expansionAPI.update(editingExpansion.id, expansionForm);
        setExpansions(expansions.map(exp => 
          exp.id === editingExpansion.id ? updated : exp
        ));
        setEditingExpansion(null);
        toast({
          title: "Espansione aggiornata",
          description: `${expansionForm.name} è stata aggiornata con successo`,
        });
      } else {
        // Create new expansion
        const newExpansion = await expansionAPI.create(expansionForm);
        setExpansions([...expansions, newExpansion]);
        toast({
          title: "Espansione creata",
          description: `${expansionForm.name} è stata creata con successo`,
        });
      }
      
      setExpansionForm({ name: '', description: '', color: '#3b82f6', image: '' });
    } catch (error) {
      console.error('Error with expansion:', error);
      toast({
        title: "Errore",
        description: error.response?.data?.detail || "Errore durante l'operazione",
        variant: "destructive",
      });
    }
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    if (!cardForm.expansion_id) {
      toast({
        title: "Errore",
        description: "Seleziona un'espansione per la carta",
        variant: "destructive",
      });
      return;
    }
    try {
      if (editingCard) {
        // Update existing card
        const updated = await cardAPI.update(editingCard.id, {
          name: cardForm.name,
          expansion_id: cardForm.expansion_id,
          ...(cardForm.image && { image: cardForm.image }),
          holo: cardForm.holo
        });
        setCards(cards.map(card => card.id === editingCard.id ? updated : card));
        setEditingCard(null);
        toast({
          title: "Carta aggiornata",
          description: `${cardForm.name} è stata aggiornata con successo`,
        });
      } else {
        // Create new card
        const newCard = await cardAPI.create({
          name: cardForm.name,
          expansion_id: cardForm.expansion_id,
          image: cardForm.image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDIwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiByeD0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSI1MCIgeT0iODAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSIjZTVlN2ViIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4/PC90ZXh0Pgo8L3N2Zz4KPC9zdmc+",
          holo: cardForm.holo
        });
        setCards([...cards, newCard]);
        
        // Update expansion in local state
        setExpansions(expansions.map(exp => 
          exp.id === cardForm.expansion_id
            ? { ...exp, total_cards: exp.total_cards + 1 }
            : exp
        ));
        
        toast({
          title: "Carta creata",
          description: `${cardForm.name} è stata creata con successo`,
        });
      }
      
      setCardForm({ name: '', expansion_id: '', image: '', holo: false });
    } catch (error) {
      console.error('Error with card:', error);
      toast({
        title: "Errore",
        description: error.response?.data?.detail || "Errore durante l'operazione",
        variant: "destructive",
      });
    }
  };

  // Upload file su ImgBB e aggiorna il campo image del form espansione
  const handleExpansionImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setExpansionImageUploading(true);
    setExpansionImageError("");
    try {
      const url = await uploadToImgBB(file);
      setExpansionForm({ ...expansionForm, image: url });
      setExpansionImageError("");
      toast({ title: "Immagine caricata!", description: "Upload su ImgBB riuscito." });
    } catch (err) {
      setExpansionImageError('Errore upload immagine su ImgBB');
      toast({ title: "Errore upload ImgBB", description: err.message, variant: "destructive" });
    } finally {
      setExpansionImageUploading(false);
    }
  };

  // Upload file su ImgBB e aggiorna il campo image del form carta
  const handleCardImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCardImageUploading(true);
    setCardImageError("");
    try {
      const url = await uploadToImgBB(file);
      setCardForm({ ...cardForm, image: url });
      setCardImageError("");
      toast({ title: "Immagine caricata!", description: "Upload su ImgBB riuscito." });
    } catch (err) {
      setCardImageError('Errore upload immagine su ImgBB');
      toast({ title: "Errore upload ImgBB", description: err.message, variant: "destructive" });
    } finally {
      setCardImageUploading(false);
    }
  };

  const deleteExpansion = async (id) => {
    try {
      await expansionAPI.delete(id);
      setExpansions(expansions.filter(exp => exp.id !== id));
      setCards(cards.filter(card => card.expansion_id !== id));
      toast({
        title: "Espansione eliminata",
        description: "L'espansione e tutte le sue carte sono state eliminate",
      });
    } catch (error) {
      console.error('Error deleting expansion:', error);
      toast({
        title: "Errore",
        description: error.response?.data?.detail || "Errore durante l'eliminazione",
        variant: "destructive",
      });
    }
  };

  const deleteCard = async (id) => {
    try {
      const card = cards.find(c => c.id === id);
      await cardAPI.delete(id);
      setCards(cards.filter(c => c.id !== id));
      
      // Update expansion total cards count
      if (card) {
        setExpansions(expansions.map(exp => 
          exp.id === card.expansion_id
            ? { ...exp, total_cards: Math.max(0, exp.total_cards - 1) }
            : exp
        ));
      }
      
      toast({
        title: "Carta eliminata",
        description: "La carta è stata eliminata con successo",
      });
    } catch (error) {
      console.error('Error deleting card:', error);
      toast({
        title: "Errore",
        description: error.response?.data?.detail || "Errore durante l'eliminazione",
        variant: "destructive",
      });
    }
  };

  const toggleUserAdmin = async (userId) => {
    try {
      const userToUpdate = users.find(u => u.id === userId);
      const updated = await adminAPI.updateUserAdmin(userId, !userToUpdate.is_admin);
      setUsers(users.map(u => 
        u.id === userId ? updated : u
      ));
      // Se in futuro aggiungi funzioni per modificare nickname/email dell'utente loggato:
      // Dopo la chiamata API di modifica, se user.id === utente modificato, chiama await refreshUser();
      // Esempio:
      // if (user && user.id === userIdModificato && typeof refreshUser === 'function') {
      //   await refreshUser();
      // }
      toast({
        title: `Ruolo aggiornato`,
        description: `${userToUpdate.nickname} è ora ${userToUpdate.is_admin ? 'utente normale' : 'amministratore'}`,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Errore",
        description: error.response?.data?.detail || "Errore durante l'aggiornamento",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <Badge variant="destructive" className="bg-red-500/20 text-red-300">
              🔒 Amministratore
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Home
            </Button>
            <Button
              onClick={logout}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              style={{ borderRadius: '0.5rem', padding: '0.5rem 1.25rem', fontWeight: 500 }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="expansions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-sm">
            <TabsTrigger value="expansions" className="text-white">Espansioni</TabsTrigger>
            <TabsTrigger value="cards" className="text-white">Carte</TabsTrigger>
            <TabsTrigger value="users" className="text-white">Utenti</TabsTrigger>
          </TabsList>

          {/* Expansions Tab */}
          <TabsContent value="expansions" className="space-y-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingExpansion ? 'Modifica Espansione' : 'Nuova Espansione'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleExpansionSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="exp-name" className="text-white">Nome</Label>
                    <Input
                      id="exp-name"
                      value={expansionForm.name}
                      onChange={(e) => setExpansionForm({...expansionForm, name: e.target.value})}
                      placeholder="Nome dell'espansione"
                      required
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="exp-desc" className="text-white">Descrizione</Label>
                    <Textarea
                      id="exp-desc"
                      value={expansionForm.description}
                      onChange={(e) => setExpansionForm({...expansionForm, description: e.target.value})}
                      placeholder="Descrizione dell'espansione"
                      className="bg-white/10 border-white/20 text-white"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="exp-color" className="text-white">Colore</Label>
                    <Input
                      id="exp-color"
                      type="color"
                      value={expansionForm.color}
                      onChange={(e) => setExpansionForm({...expansionForm, color: e.target.value})}
                      className="bg-white/10 border-white/20 h-12"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Label htmlFor="exp-image-file" className="text-white">Immagine</Label>
                      <Input
                        id="exp-image-file"
                        type="file"
                        accept="image/*"
                        onChange={handleExpansionImageUpload}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                  {expansionForm.image && (
                    <div className="mt-2">
                      <img src={expansionForm.image} alt="Anteprima" className="w-24 h-32 object-cover rounded-lg border border-white/20" />
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <input
                      id="exp-published"
                      type="checkbox"
                      checked={expansionForm.published}
                      onChange={e => setExpansionForm({ ...expansionForm, published: e.target.checked })}
                      className="form-checkbox h-5 w-5 text-green-500"
                    />
                    <Label htmlFor="exp-published" className="text-white">Pubblica</Label>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-600" disabled={expansionImageUploading || !expansionForm.image}>
                      {editingExpansion ? 'Aggiorna' : 'Crea'} Espansione
                    </Button>
                    {editingExpansion && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setEditingExpansion(null);
                          setExpansionForm({ name: '', description: '', color: '#3b82f6', image: '' });
                        }}
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        Annulla
                      </Button>
                    )}
                  </div>
                  {expansionImageUploading && <span className="text-xs text-white ml-2">Caricamento immagine...</span>}
                  {expansionImageError && <span className="text-xs text-red-400 ml-2">{expansionImageError}</span>}
                  {expansionForm.image && <span className="text-xs text-green-400 ml-2">URL: {expansionForm.image}</span>}
                </form>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expansions.map((expansion) => (
                <Card key={expansion.id} className="bg-black/20 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">{expansion.name}</CardTitle>
                        <CardDescription className="text-white/70">{expansion.description}</CardDescription>
                      </div>
                      {expansion.image ? (
                        <img src={expansion.image} alt={expansion.name} className="w-24 h-32 object-cover rounded-lg border border-white/20" />
                      ) : (
                        <Badge style={{ backgroundColor: expansion.color }} className="text-white">
                          {expansion.total_cards} carte
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingExpansion(expansion);
                          setExpansionForm({
                            name: expansion.name,
                            description: expansion.description,
                            color: expansion.color,
                            image: expansion.image || '',
                            published: expansion.published ?? false
                          });
                        }}
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        Modifica
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteExpansion(expansion.id)}
                      >
                        Elimina
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-6">
            <Tabs defaultValue="single" className="space-y-4">
              <TabsList className="w-full bg-black/10 mb-4">
                <TabsTrigger value="single" className="text-white">Carta Singola</TabsTrigger>
                <TabsTrigger value="multiple" className="text-white">Molteplici Carte</TabsTrigger>
              </TabsList>
              {/* Tab: Carta Singola */}
              <TabsContent value="single">
                <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {editingCard ? 'Modifica Carta' : 'Nuova Carta'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCardSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="card-name" className="text-white">Nome</Label>
                        <Input
                          id="card-name"
                          value={cardForm.name}
                          onChange={(e) => setCardForm({...cardForm, name: e.target.value})}
                          placeholder="Nome della carta"
                          required
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="card-expansion" className="text-white">Espansione</Label>
                        <Select value={cardForm.expansion_id} onValueChange={(value) => setCardForm({...cardForm, expansion_id: value})}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Seleziona espansione" />
                          </SelectTrigger>
                          <SelectContent>
                            {expansions.map((expansion) => (
                              <SelectItem key={expansion.id} value={expansion.id}>
                                {expansion.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="card-image" className="text-white">Immagine</Label>
                        <Input
                          id="card-image"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleCardImageUpload}
                          className="bg-white/10 border-white/20 text-white"
                        />
                        {cardForm.image && (
                          <div className="mt-2">
                            <img src={cardForm.image} alt="Preview" className="w-24 h-32 object-cover rounded" />
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="card-holo" className="text-white flex items-center space-x-2">
                          <input
                            id="card-holo"
                            type="checkbox"
                            checked={cardForm.holo}
                            onChange={e => setCardForm({ ...cardForm, holo: e.target.checked })}
                            className="mr-2"
                          />
                          <span>Olografica</span>
                        </Label>
                      </div>
                      <div className="flex space-x-2">
                        <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600" disabled={cardImageUploading || !cardForm.image}>
                          {editingCard ? 'Aggiorna' : 'Crea'} Carta
                        </Button>
                        {editingCard && (
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                              setEditingCard(null);
                              setCardForm({ name: '', expansion_id: '', image: '' });
                            }}
                            className="border-white/30 text-white hover:bg-white/10"
                          >
                            Annulla
                          </Button>
                        )}
                      </div>
                      {cardImageUploading && <span className="text-xs text-white ml-2">Caricamento immagine...</span>}
                      {cardImageError && <span className="text-xs text-red-400 ml-2">{cardImageError}</span>}
                      {cardForm.image && <span className="text-xs text-green-400 ml-2">URL: {cardForm.image}</span>}
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Tab: Molteplici Carte */}
              <TabsContent value="multiple">
                <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Carica Più Carte</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MultipleCardsUpload
                      expansions={expansions}
                      onCardsCreated={(newCards) => {
                        setCards([...cards, ...newCards]);
                        // Aggiorna il conteggio carte nelle espansioni
                        const updatedExpansions = [...expansions];
                        newCards.forEach(card => {
                          const idx = updatedExpansions.findIndex(e => e.id === card.expansion_id);
                          if (idx !== -1) updatedExpansions[idx].total_cards += 1;
                        });
                        setExpansions(updatedExpansions);
                      }}
                      uploadToImgBB={uploadToImgBB}
                      toast={toast}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end mb-2">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-xs mr-2"
                onClick={() => setCardsViewMode(cardsViewMode === 'grid' ? 'list' : 'grid')}
              >
                {cardsViewMode === 'grid' ? 'Vista Elenco' : 'Vista Tabella'}
              </Button>
            </div>
            {cardsViewMode === 'list' ? (
              <div className="bg-black/10 rounded-lg p-2">
                <ul className="divide-y divide-white/10">
                  {cards.map((card) => {
                    const expansion = expansions.find(e => e.id === card.expansion_id);
                    return (
                      <li key={card.id} className="flex items-center py-2">
                        <span
                          className="text-white font-semibold text-sm cursor-pointer relative"
                          onMouseEnter={e => {
                            const preview = document.createElement('div');
                            preview.className = 'fixed z-50 p-1 bg-black/80 rounded border border-white/20';
                            preview.style.left = `${e.clientX + 10}px`;
                            preview.style.top = `${e.clientY - 20}px`;
                            preview.innerHTML = `<img src='${card.image}' style='width:60px;height:80px;object-fit:cover;border-radius:4px;' />`;
                            preview.id = `preview-${card.id}`;
                            document.body.appendChild(preview);
                          }}
                          onMouseLeave={() => {
                            const preview = document.getElementById(`preview-${card.id}`);
                            if (preview) preview.remove();
                          }}
                        >
                          {card.name}
                        </span>
                        <span className="ml-2 text-xs text-white/70">({expansion?.name})</span>
                        {card.holo && <Badge className="ml-2 text-xs bg-gradient-to-r from-blue-400 to-purple-500 text-white">Holo</Badge>}
                        <div className="flex-1" />
                        <Button size="sm" variant="outline" onClick={() => { setEditingCard(card); setCardForm({ name: card.name, expansion_id: card.expansion_id, image: card.image, holo: card.holo || false }); }} className="border-white/30 text-white hover:bg-white/10 text-xs mr-1">Modifica</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteCard(card.id)} className="text-xs">Elimina</Button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-2">
                {cards.map((card) => {
                  const expansion = expansions.find(e => e.id === card.expansion_id);
                  return (
                    <Card key={card.id} className="bg-black/20 border-white/10 backdrop-blur-sm p-2 cursor-pointer" onClick={() => setSelectedCardModal(card)}>
                      <CardContent className="p-2">
                        <div className="aspect-[3/4] mb-1 rounded-lg overflow-hidden w-16 h-20 mx-auto">
                          <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-white font-semibold text-xs mb-1 text-center truncate" title={card.name}>{card.name}</h3>
                        <Badge className="text-xxs mb-1" style={{ backgroundColor: expansion?.color }}>{expansion?.name}</Badge>
                        {card.holo && <Badge className="text-xxs bg-gradient-to-r from-blue-400 to-purple-500 text-white ml-1">Holo</Badge>}
                        <div className="flex justify-center mt-1">
                          <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); setEditingCard(card); setCardForm({ name: card.name, expansion_id: card.expansion_id, image: card.image, holo: card.holo || false }); }} className="border-white/30 text-white hover:bg-white/10 text-xxs mr-1">Modifica</Button>
                          <Button size="sm" variant="destructive" onClick={e => { e.stopPropagation(); deleteCard(card.id); }} className="text-xxs">Elimina</Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Gestione Utenti</CardTitle>
                <CardDescription className="text-white/70">
                  Gestisci i permessi di amministratore per gli utenti registrati
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h3 className="text-white font-semibold">{user.nickname}</h3>
                        <p className="text-white/70 text-sm">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={user.is_admin ? "destructive" : "secondary"}>
                          {user.is_admin ? "Admin" : "Utente"}
                        </Badge>
                        <Button
                          size="sm"
                          variant={user.is_admin ? "outline" : "default"}
                          onClick={() => toggleUserAdmin(user.id)}
                          className={user.is_admin 
                            ? "border-white/30 text-white hover:bg-white/10" 
                            : "bg-gradient-to-r from-red-500 to-pink-600"
                          }
                        >
                          {user.is_admin ? "Rimuovi Admin" : "Rendi Admin"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={async () => {
                            try {
                              await adminAPI.resetUserFoundCards(user.id);
                              setUsers(users.map(u => u.id === user.id ? { ...u, found_cards: [] } : u));
                              if (user.id === user.id && typeof refreshUser === 'function') {
                                await refreshUser();
                              }
                              toast({
                                title: "Carte trovate azzerate",
                                description: `Tutte le carte trovate di ${user.nickname} sono state azzerate.`
                              });
                            } catch (error) {
                              toast({
                                title: "Errore",
                                description: error.response?.data?.detail || "Errore durante l'azzeramento delle carte trovate",
                                variant: "destructive"
                              });
                            }
                          }}
                          className="ml-2"
                        >
                          Azzera carte trovate
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="ml-2"
                          style={{ display: 'none' }} // Nasconde il pulsante Reset password
                        >
                          Reset password
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedCardModal} onOpenChange={v => !v && setSelectedCardModal(null)}>
          <DialogContent>
            {selectedCardModal && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedCardModal.name}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-md mb-4">
                    <img
                      src={selectedCardModal.image}
                      alt={selectedCardModal.name}
                      className="w-full rounded-lg shadow-lg"
                      style={{ objectFit: 'contain', background: '#fff' }}
                    />
                    {selectedCardModal.holo && (
                      <div className="absolute inset-0 pointer-events-none holo-effect rounded-lg" />
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Admin;