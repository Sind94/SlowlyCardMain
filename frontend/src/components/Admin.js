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

const Admin = () => {
  const { user, logout } = useAuth();
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
    image: ''
  });
  const [cardForm, setCardForm] = useState({
    name: '',
    expansion_id: '',
    image: ''
  });
  const [editingExpansion, setEditingExpansion] = useState(null);
  const [editingCard, setEditingCard] = useState(null);

  // Check if user is admin
  const isAdmin = user?.is_admin;
  const imgurClientId = '546b1b1b1b1b1b1'; // Sostituisci con il tuo client ID Imgur se vuoi personalizzato
  const fileInputRef = useRef();

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
          ...(cardForm.image && { image: cardForm.image })
        });
        setCards(cards.map(card => 
          card.id === editingCard.id ? updated : card
        ));
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
          image: cardForm.image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDIwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiByeD0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSI1MCIgeT0iODAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSIjZTVlN2ViIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4/PC90ZXh0Pgo8L3N2Zz4KPC9zdmc+"
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
      
      setCardForm({ name: '', expansion_id: '', image: '' });
    } catch (error) {
      console.error('Error with card:', error);
      toast({
        title: "Errore",
        description: error.response?.data?.detail || "Errore durante l'operazione",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCardForm({ ...cardForm, image: e.target.result });
      };
      reader.readAsDataURL(file);
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
      const user = users.find(u => u.id === userId);
      const updated = await adminAPI.updateUserAdmin(userId, !user.is_admin);
      setUsers(users.map(u => 
        u.id === userId ? updated : u
      ));
      toast({
        title: `Ruolo aggiornato`,
        description: `${user.nickname} è ora ${user.is_admin ? 'utente normale' : 'amministratore'}`,
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
                      <Label htmlFor="exp-image" className="text-white">Immagine (URL)</Label>
                      <Input
                        id="exp-image"
                        type="url"
                        value={expansionForm.image}
                        onChange={(e) => setExpansionForm({...expansionForm, image: e.target.value})}
                        placeholder="https://..."
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="exp-image-file" className="text-white">Oppure carica</Label>
                      <Input
                        id="exp-image-file"
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append('image', file);
                          // Upload su Imgur
                          const res = await fetch('https://api.imgur.com/3/image', {
                            method: 'POST',
                            headers: { Authorization: `Client-ID ${imgurClientId}` },
                            body: formData
                          });
                          const data = await res.json();
                          if (data.success) {
                            setExpansionForm({...expansionForm, image: data.data.link});
                          } else {
                            alert('Errore upload immagine');
                          }
                        }}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>
                  {expansionForm.image && (
                    <div className="mt-2">
                      <img src={expansionForm.image} alt="Anteprima" className="w-24 h-32 object-cover rounded-lg border border-white/20" />
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-600">
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
                            image: expansion.image || ''
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
                    <Label htmlFor="card-image" className="text-white">Immagine (JPEG)</Label>
                    <Input
                      id="card-image"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleImageUpload}
                      className="bg-white/10 border-white/20 text-white"
                    />
                    {cardForm.image && (
                      <div className="mt-2">
                        <img src={cardForm.image} alt="Preview" className="w-24 h-32 object-cover rounded" />
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600">
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
                </form>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {cards.map((card) => {
                const expansion = expansions.find(e => e.id === card.expansion_id);
                return (
                  <Card key={card.id} className="bg-black/20 border-white/10 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="aspect-[3/4] mb-3 rounded-lg overflow-hidden">
                        <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-2">{card.name}</h3>
                      <Badge 
                        className="text-xs mb-3"
                        style={{ backgroundColor: expansion?.color }}
                      >
                        {expansion?.name}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingCard(card);
                            setCardForm({
                              name: card.name,
                              expansion_id: card.expansion_id,
                              image: card.image
                            });
                          }}
                          className="border-white/30 text-white hover:bg-white/10 text-xs"
                        >
                          Modifica
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteCard(card.id)}
                          className="text-xs"
                        >
                          Elimina
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;