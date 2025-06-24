import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="absolute top-8 left-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          SlowlyCard
        </h1>
        <p className="text-white/70 text-lg mt-2">Il mondo delle carte magiche ti aspetta</p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-8xl mb-4 animate-bounce">🎴</div>
          <h2 className="text-4xl font-bold text-white mb-2">
            {isLogin ? 'Bentornato!' : 'Unisciti all\'avventura!'}
          </h2>
          <p className="text-white/80 text-lg">
            {isLogin 
              ? 'Accedi per continuare la tua collezione' 
              : 'Crea il tuo account e inizia a collezionare'
            }
          </p>
        </div>

        <div className="transform transition-all duration-500">
          {isLogin ? (
            <LoginForm onToggleForm={toggleForm} />
          ) : (
            <RegisterForm onToggleForm={toggleForm} />
          )}
        </div>

        {/* Features Preview */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="text-2xl mb-2">📚</div>
            <p className="text-white/80 text-sm">Album</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="text-2xl mb-2">🎁</div>
            <p className="text-white/80 text-sm">Pacchetti</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="text-2xl mb-2">✨</div>
            <p className="text-white/80 text-sm">Collezioni</p>
          </div>
        </div>
      </div>

      {/* Floating Cards Animation */}
      <div className="fixed top-20 right-20 animate-float">
        <div className="w-16 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg shadow-xl transform rotate-12"></div>
      </div>
      <div className="fixed bottom-32 left-20 animate-float-delayed">
        <div className="w-16 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-xl transform -rotate-12"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: rotate(12deg) translateY(0px); }
          50% { transform: rotate(12deg) translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: rotate(-12deg) translateY(0px); }
          50% { transform: rotate(-12deg) translateY(-15px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 1.5s;
        }
      `}</style>
    </div>
  );
};

export default Auth;