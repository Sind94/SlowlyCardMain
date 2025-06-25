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

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [expansionsData, allCardsData, userData] = await Promise.all([
          expansionAPI.getAll(),
          cardAPI.getAll(),
          authAPI.getCurrentUser()
        ]);
        setExpansions(expansionsData);
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
            {allExpansionCards.map((card) => {
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
                        <img 
                          src={card.image} 
                          alt={card.name}
                          className="w-full h-full object-cover"
                          style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.7)' }}
                        />
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
          {/* MODALE ZOOM IMMAGINE */}
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
                    <img
                      src={selectedCard.image}
                      alt={selectedCard.name}
                      className="w-full max-w-md rounded-lg shadow-lg mb-4"
                      style={{ objectFit: 'contain', background: '#fff' }}
                    />
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
                    className="w-24 h-32 mx-auto mb-4 rounded-lg overflow-hidden transform transition-all duration-300 group-hover:rotate-3"
                    style={{ backgroundColor: expansion.color }}
                  >
                    {expansion.image ? (
                      <img 
                        src={expansion.image} 
                        alt={expansion.name}
                        className="w-full h-full object-cover"
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
    </div>
  );
};

export default Album;