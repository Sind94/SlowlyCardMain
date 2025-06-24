import React from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminButton = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAdminClick = () => {
    // Chiunque può cliccare, ma solo gli admin possono accedere
    navigate('/admin');
  };

  return (
    <Button 
      onClick={handleAdminClick}
      variant="outline"
      className="border-red-400/30 text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-all duration-200"
      size="sm"
    >
      🔒 Admin
    </Button>
  );
};

export default AdminButton;