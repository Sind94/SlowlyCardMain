import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI, expansionAPI, cardAPI } from '../services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import AdminButton from './AdminButton';

const Album = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expansions, setExpansions] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpansion, setSelectedExpansion] = useState(null);
  const [selectedExpansionImage, setSelectedExpansionImage] = useState(null);
  const [expansionImageDialogOpen, setExpansionImageDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [expansionsData, allCardsData, userData] = await Promise.all([
          expansionAPI.getAll(),
          cardAPI.getAll(),
          authAPI.getCurrentUser()
        ]);
        // Mostra solo le espansioni pubblicate
        setExpansions(expansionsData.filter(exp => exp.published));
        setCards(allCardsData);
        setLocalUser(userData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const getFoundCardsForExpansion = (expansionId) => {
    return cards.filter(card => 
      card.expansion_id === expansionId && localUser?.found_cards?.includes(card.id)
    );
  };

  const getCompletionPercentage = (expansionId) => {
    const totalCards = cards.filter(card => card.expansion_id === expansionId).length;
    const foundCards = getFoundCardsForExpansion(expansionId).length;
    return totalCards > 0 ? Math.round((foundCards / totalCards) * 100) : 0;
  };

  // Gestione click su carta trovata
  const handleCardClick = (card, isFound) => {
    if (isFound) {
      setSelectedCard(card);
      setDialogOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-white/20 border-t-white rounded-full"></div>
      </div>
    );
  }

  if (selectedExpansion) {
    const foundCards = getFoundCardsForExpansion(selectedExpansion.id);
    const allExpansionCards = cards.filter(card => card.expansion_id === selectedExpansion.id);
    // Ordina le carte per 'order' crescente (se presente), altrimenti per 'created_at'
    const allExpansionCardsSorted = [...allExpansionCards].sort((a, b) => {
      if (a.order != null && b.order != null) {
        return a.order - b.order;
      } else if (a.order != null) {
        return -1;
      } else if (b.order != null) {
        return 1;
      } else {
        // fallback: ordina per data di creazione
        return new Date(a.created_at) - new Date(b.created_at);
      }
    });
    // Mostra la modale solo se siamo dentro l'espansione e l'utente clicca l'immagine
    const showExpansionImageModal = expansionImageDialogOpen && selectedExpansion.image;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setSelectedExpansion(null)}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                ← Torna all'Album
              </Button>
              <h1 className="text-2xl font-bold text-white">
                {selectedExpansion.name}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <AdminButton />
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Home
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Immagine espansione centrale e cliccabile */}
          {selectedExpansion.image && (
            <div className="flex justify-center mb-8">
              <img
                src={selectedExpansion.image}
                alt={selectedExpansion.name}
                className="w-40 h-56 object-cover rounded-xl shadow-lg cursor-zoom-in transition-transform duration-200 hover:scale-105"
                onClick={() => setExpansionImageDialogOpen(true)}
                style={{ background: '#fff' }}
              />
            </div>
          )}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-white">
                Le tue carte: {foundCards.length}/{allExpansionCards.length}
              </h2>
              <Badge 
                className="text-lg px-4 py-2" 
                style={{ backgroundColor: selectedExpansion.color }}
              >
                {getCompletionPercentage(selectedExpansion.id)}% Completato
              </Badge>
            </div>
            <Progress 
              value={getCompletionPercentage(selectedExpansion.id)} 
              className="h-3"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allExpansionCardsSorted.map((card) => {
              const isFound = localUser?.found_cards?.includes(card.id);
              return (
                <Card 
                  key={card.id}
                  className={`$${
                    isFound 
                      ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-400/30' 
                      : 'bg-black/60 border-gray-800/60'
                  } backdrop-blur-sm transform transition-all duration-300 hover:scale-105`}
                  onClick={() => handleCardClick(card, isFound)}
                  style={{ cursor: isFound ? 'zoom-in' : 'not-allowed' }}
                >
                  <CardContent className="p-3">
                    <div className={`aspect-[3/4] mb-2 rounded-lg overflow-hidden flex items-center justify-center ${isFound ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-900 shadow-lg' : 'bg-black/60'}`}> 
                      {isFound ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={card.image} 
                            alt={card.name}
                            className="w-full h-full object-cover"
                            style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.7)' }}
                          />
                          {card.holo && (
                            <div className="absolute inset-0 pointer-events-none holo-effect" />
                          )}
                        </div>
                      ) : (
                        <div className="text-4xl text-gray-500">❓</div>
                      )}
                    </div>
                    <h3 className={`text-sm font-semibold text-center ${
                      isFound ? 'text-white' : 'text-gray-400'
                    }`}>
                      {isFound ? card.name : '???'}
                    </h3>
                    {isFound && (
                      <Badge variant="secondary" className="w-full mt-2 bg-red-500 text-white justify-center">
                        Trovata!
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {/* MODALE ZOOM IMMAGINE ESPANSIONE SOLO QUI */}
          <Dialog open={showExpansionImageModal} onOpenChange={v => setExpansionImageDialogOpen(v)}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>{selectedExpansion.name}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-md mb-4">
                  <img
                    src={selectedExpansion.image}
                    alt={selectedExpansion.name}
                    className="w-full rounded-lg shadow-lg"
                    style={{ objectFit: 'contain', background: '#fff' }}
                  />
                </div>
                <div className="text-center text-white/80 text-lg mb-2">{selectedExpansion.description}</div>
              </div>
            </DialogContent>
          </Dialog>
          {/* MODALE ZOOM IMMAGINE CARTA */}
          <Dialog open={dialogOpen} onOpenChange={v => {
            setDialogOpen(v);
            if (!v) setSelectedCard(null);
          }}>
            <DialogContent className="max-w-2xl">
              {selectedCard && (
                <>
                  <DialogHeader>
                    <DialogTitle>{selectedCard.name}</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center">
                    <div className="relative w-full max-w-md mb-4">
                      <img
                        src={selectedCard.image}
                        alt={selectedCard.name}
                        className="w-full rounded-lg shadow-lg"
                        style={{ objectFit: 'contain', background: '#fff' }}
                      />
                      {selectedCard.holo && (
                        <div className="absolute inset-0 pointer-events-none holo-effect rounded-lg" />
                      )}
                    </div>
                    <div className="text-center text-white/80 text-lg mb-2">{selectedCard.description}</div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Il tuo Album
            </h1>
            <Badge variant="secondary" className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
              {localUser?.nickname}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <AdminButton />
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

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Le tue Collezioni
          </h2>
          <p className="text-xl text-white/80">
            Esplora le espansioni e scopri tutte le carte che hai collezionato
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expansions.map((expansion) => {
            const foundCount = getFoundCardsForExpansion(expansion.id).length;
            const totalCount = cards.filter(card => card.expansion_id === expansion.id).length;
            const completionPercentage = getCompletionPercentage(expansion.id);

            return (
              <Card 
                key={expansion.id}
                className="bg-gradient-to-br from-black/40 to-black/20 border-white/10 backdrop-blur-sm transform transition-all duration-300 hover:scale-105 cursor-pointer group"
                onClick={() => setSelectedExpansion(expansion)}
              >
                <CardHeader className="text-center">
                  <div 
                    className="w-24 h-32 mx-auto mb-4 rounded-lg overflow-hidden flex items-center justify-center bg-white/5"
                    style={{ backgroundColor: expansion.color }}
                  >
                    {expansion.image ? (
                      <img 
                        src={expansion.image} 
                        alt={expansion.name}
                        className="w-full h-full object-cover object-center cursor-zoom-in transition-transform duration-200 hover:scale-110"
                        style={{ display: 'block' }}
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedExpansionImage(expansion);
                          setExpansionImageDialogOpen(true);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-2xl">
                        📚
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-xl text-white mb-2">
                    {expansion.name}
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    {expansion.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Progresso:</span>
                      <Badge 
                        className="text-white"
                        style={{ backgroundColor: expansion.color }}
                      >
                        {foundCount}/{totalCount}
                      </Badge>
                    </div>
                    <Progress 
                      value={completionPercentage} 
                      className="h-2"
                    />
                    <p className="text-center text-white/60 text-sm">
                      {completionPercentage}% Completato
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {/* Dialog per immagine espansione anche qui */}
        <Dialog open={!!selectedExpansionImage} onOpenChange={v => {
          if (!v) setSelectedExpansionImage(null);
          setExpansionImageDialogOpen(v);
        }}>
          <DialogContent className="max-w-xl">
            {selectedExpansionImage && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedExpansionImage.name}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-md mb-4">
                    <img
                      src={selectedExpansionImage.image}
                      alt={selectedExpansionImage.name}
                      className="w-full rounded-lg shadow-lg"
                      style={{ objectFit: 'contain', background: '#fff' }}
                    />
                  </div>
                  <div className="text-center text-white/80 text-lg mb-2">{selectedExpansionImage.description}</div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Overall Stats */}
        <div className="mt-16">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Statistiche Generali</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-yellow-400">{localUser?.found_cards?.length || 0}</p>
                  <p className="text-white/70">Carte Totali</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-400">{expansions.length}</p>
                  <p className="text-white/70">Espansioni</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-400">
                    {cards.length > 0 ? Math.round(((localUser?.found_cards?.length || 0) / cards.length) * 100) : 0}%
                  </p>
                  <p className="text-white/70">Completamento</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <style>
{`
.holo-effect {
  background: linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(0,255,255,0.15) 30%, rgba(255,0,255,0.15) 60%, rgba(255,255,255,0.2) 100%);
  background-size: 200% 200%;
  animation: holo-glitter 2.5s linear infinite;
  mix-blend-mode: lighten;
  border-radius: 0.5rem;
}
@keyframes holo-glitter {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
`}
</style>
    </div>
  );
};

export default Album;