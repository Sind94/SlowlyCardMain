import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { expansionAPI } from '../services/api';
import AdminButton from './AdminButton';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expansions, setExpansions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpansions = async () => {
      try {
        const data = await expansionAPI.getAll();
        setExpansions(data);
      } catch (error) {
        console.error('Error fetching expansions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpansions();
  }, []);

  // Filtra le espansioni pubblicate se l'utente non è admin
  const isAdmin = user?.role === 'admin';
  const publicExpansions = isAdmin ? expansions : expansions.filter(e => e.published);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              SlowlyCard
            </h1>
            <Badge variant="secondary" className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
              Benvenuto, {user?.nickname}!
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <AdminButton />
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Benvenuto nel mondo di SlowlyCard!
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Scopri espansioni magiche, apri pacchetti misteriosi e colleziona carte uniche
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Album Card */}
          <Card 
            className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-400/30 backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group"
            onClick={() => navigate('/album')}
          >
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:rotate-12">
                <span className="text-3xl text-white">📚</span>
              </div>
              <CardTitle className="text-2xl text-white mb-2">Album</CardTitle>
              <CardDescription className="text-white/70 text-lg">
                Esplora le tue collezioni e scopri quali carte hai già trovato
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-white/60 mb-4">
                Visualizza tutte le espansioni e le carte uniche che hai collezionato
              </p>
              <div className="bg-blue-500/20 rounded-lg p-4">
                <p className="text-blue-300 font-semibold">
                  Carte trovate: {user?.found_cards?.length || 0}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Spacchetta Card */}
          <Card 
            className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-400/30 backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group"
            onClick={() => navigate('/spacchetta')}
          >
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:rotate-12">
                <span className="text-3xl text-white">🎁</span>
              </div>
              <CardTitle className="text-2xl text-white mb-2">Spacchetta</CardTitle>
              <CardDescription className="text-white/70 text-lg">
                Apri pacchetti misteriosi e scopri nuove carte magiche
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-white/60 mb-4">
                Scegli un'espansione e apri pacchetti da 5 carte casuali
              </p>
              <div className="bg-orange-500/20 rounded-lg p-4">
                <p className="text-orange-300 font-semibold">
                  ✨ Nuove avventure ti aspettano!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-white">Le tue statistiche</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">{user?.found_cards?.length || 0}</p>
                  <p className="text-white/70">Carte Trovate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">{loading ? '...' : publicExpansions.length}</p>
                  <p className="text-white/70">Espansioni</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Expansions Preview */}
        {!loading && publicExpansions.length > 0 && (
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              Espansioni Disponibili
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {publicExpansions.slice(0, 3).map((expansion) => (
                <Card 
                  key={expansion.id}
                  className="bg-black/20 border-white/10 backdrop-blur-sm transform transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => navigate('/spacchetta')}
                >
                  <CardHeader className="text-center">
                    <div 
                      className="w-16 h-20 mx-auto mb-3 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: expansion.color }}
                    >
                      {expansion.image ? (
                        <img 
                          src={expansion.image} 
                          alt={expansion.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-2xl text-white">📦</div>
                      )}
                    </div>
                    <CardTitle className="text-lg text-white">{expansion.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge 
                      className="text-white text-sm"
                      style={{ backgroundColor: expansion.color }}
                    >
                      {expansion.total_cards} carte
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
            {publicExpansions.length > 3 && (
              <div className="text-center mt-6">
                <Button 
                  onClick={() => navigate('/spacchetta')}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Vedi tutte le espansioni
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Elements */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
    </div>
  );
};

export default Home;