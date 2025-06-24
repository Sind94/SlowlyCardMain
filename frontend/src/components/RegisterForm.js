import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { useToast } from '../hooks/use-toast';

const RegisterForm = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Errore",
        description: "Le password non coincidono",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(formData.email, formData.nickname, formData.password);
      if (result.success) {
        toast({
          title: "Benvenuto!",
          description: "Registrazione completata con successo",
        });
      } else {
        toast({
          title: "Errore",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la registrazione",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md transform transition-all duration-300 hover:scale-105">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          Unisciti a SlowlyCard
        </CardTitle>
        <CardDescription className="text-lg">
          Inizia la tua avventura nel mondo delle carte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="la-tua-email@esempio.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              name="nickname"
              type="text"
              placeholder="Il tuo nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Conferma Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transform transition-all duration-200 hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? 'Registrazione in corso...' : 'Registrati'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={onToggleForm}
            className="text-orange-500 hover:text-orange-700 transition-colors duration-200 font-medium"
          >
            Hai già un account? Accedi
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;