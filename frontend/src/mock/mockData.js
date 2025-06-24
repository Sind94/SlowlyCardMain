// Mock data per SlowlyCard
export const mockExpansions = [
  {
    id: 1,
    name: "Avventura Magica",
    description: "La prima espansione di SlowlyCard con creature magiche",
    totalCards: 75,
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDIwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiByeD0iMTAiIGZpbGw9InVybCgjZ3JhZGllbnQxKSIvPgo8ZGVmcz4KPGF0ZGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZjZkMDAiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmY5MDAwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHN2ZyB4PSI1MCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiPgo8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4yIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7il4s8L3RleHQ+Cjwvc3ZnPgo8L3N2Zz4K",
    color: "#ff8c00"
  },
  {
    id: 2,
    name: "Guerrieri Leggendari",
    description: "Potenti guerrieri dalle terre lontane",
    totalCards: 60,
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDIwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiByeD0iMTAiIGZpbGw9InVybCgjZ3JhZGllbnQyKSIvPgo8ZGVmcz4KPGF0ZGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxZTNhOGEiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjM2I4MmY2Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHN2ZyB4PSI1MCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiPgo8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4yIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7imYo8L3RleHQ+Cjwvc3ZnPgo8L3N2Zz4K",
    color: "#3b82f6"
  },
  {
    id: 3,
    name: "Natura Selvaggia",
    description: "Creature della foresta e della natura",
    totalCards: 80,
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDIwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiByeD0iMTAiIGZpbGw9InVybCgjZ3JhZGllbnQzKSIvPgo8ZGVmcz4KPGF0ZGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxNjcyM2QiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMTBiOTgxIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHN2ZyB4PSI1MCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiPgo8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4yIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn42/PC90ZXh0Pgo8L3N2Zz4KPC9zdmc+Cg==",
    color: "#10b981"
  }
];

export const mockCards = [
  {
    id: 1,
    name: "Drago di Fuoco",
    expansionId: 1,
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDIwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiByeD0iMTAiIGZpbGw9InVybCgjZ3JhZGllbnQ0KSIvPgo8ZGVmcz4KPGF0ZGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50NCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNkYzI2MjYiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZWY0NDQ0Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHN2ZyB4PSI1MCIgeT0iODAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSIjZmZmZmZmIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZGMyNjI2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5OSPC90ZXh0Pgo8L3N2Zz4KPHN2ZyB4PSI1MCIgeT0iMjAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjMwIj4KPHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjMwIiB2aWV3Qm94PSIwIDAgMTAwIDMwIj4KPHRleHQgeD0iNTAiIHk9IjIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5EcmFnbyBkaSBGdW9jbzwvdGV4dD4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4K"
  },
  {
    id: 2,
    name: "Fata Luminosa",
    expansionId: 1,
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDIwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiByeD0iMTAiIGZpbGw9InVybCgjZ3JhZGllbnQ1KSIvPgo8ZGVmcz4KPGF0ZGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50NSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZWY5ZTciLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmVmMDhjIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHN2ZyB4PSI1MCIgeT0iODAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSIjZmZmZmZmIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmVmMDhjIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn6eaPC90ZXh0Pgo8L3N2Zz4KPHN2ZyB4PSI1MCIgeT0iMjAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjMwIj4KPHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjMwIiB2aWV3Qm94PSIwIDAgMTAwIDMwIj4KPHRleHQgeD0iNTAiIHk9IjIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5GYXRhIEx1bWlub3NhPC90ZXh0Pgo8L3N2Zz4KPC9zdmc+CjwvnNdnZz4K"
  },
  {
    id: 3,
    name: "Cavaliere Coraggioso",
    expansionId: 2,
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDIwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiByeD0iMTAiIGZpbGw9InVybCgjZ3JhZGllbnQ2KSIvPgo8ZGVmcz4KPGF0ZGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50NiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MzY2ZjEiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjOGI4Y2Y2Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHN2ZyB4PSI1MCIgeT0iODAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSIjZmZmZmZmIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjNjM2NmYxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5uhPC90ZXh0Pgo8L3N2Zz4KPHN2ZyB4PSI1MCIgeT0iMjAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjMwIj4KPHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjMwIiB2aWV3Qm94PSIwIDAgMTAwIDMwIj4KPHRleHQgeD0iNTAiIHk9IjIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5DYXZhbGllcmUgQ29yYWdnaW9zbzwvdGV4dD4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4K"
  },
  {
    id: 4,
    name: "Lupo Selvaggio",
    expansionId: 3,
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDIwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjgwIiByeD0iMTAiIGZpbGw9InVybCgjZ3JhZGllbnQ3KSIvPgo8ZGVmcz4KPGF0ZGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50NyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwNTk2NjkiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGQ5NGE4Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHN2ZyB4PSI1MCIgeT0iODAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSIjZmZmZmZmIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjMDU5NjY5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5OSPC90ZXh0Pgo8L3N2Zz4KPHN2ZyB4PSI1MCIgeT0iMjAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjMwIj4KPHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjMwIiB2aWV3Qm94PSIwIDAgMTAwIDMwIj4KPHRleHQgeD0iNTAiIHk9IjIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5MdXBvIFNlbHZhZ2dpbzwvdGV4dD4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4K"
  }
];

// Dati utente mock
export const mockUser = {
  id: 1,
  email: "test@example.com",
  nickname: "TestUser",
  foundCards: [1, 2, 3] // ID delle carte trovate
};

// Dati per simulare un pacchetto aperto
export const generateRandomCards = (expansionId, count = 5) => {
  const expansionCards = mockCards.filter(card => card.expansionId === expansionId);
  const randomCards = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * expansionCards.length);
    randomCards.push(expansionCards[randomIndex]);
  }
  
  return randomCards;
};

// Simulazione dati locale
let localUserData = {
  ...mockUser,
  foundCards: [...mockUser.foundCards]
};

export const saveFoundCards = (cardIds) => {
  cardIds.forEach(cardId => {
    if (!localUserData.foundCards.includes(cardId)) {
      localUserData.foundCards.push(cardId);
    }
  });
  localStorage.setItem('slowlycard_user', JSON.stringify(localUserData));
};

export const getLocalUserData = () => {
  const stored = localStorage.getItem('slowlycard_user');
  if (stored) {
    localUserData = JSON.parse(stored);
  }
  return localUserData;
};

export const clearLocalUserData = () => {
  localStorage.removeItem('slowlycard_user');
  localUserData = {
    ...mockUser,
    foundCards: [...mockUser.foundCards]
  };
};