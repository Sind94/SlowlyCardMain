# Usa un'immagine Node.js ufficiale come base
FROM node:20-alpine

# Imposta la directory di lavoro all'interno del container
WORKDIR /usr/src/app

# Copia i file di configurazione delle dipendenze
COPY package*.json ./

# Installa le dipendenze
RUN npm install --legacy-peer-deps

# Copia tutto il resto del codice sorgente
COPY . .

# Compila il progetto TypeScript (se presente)
RUN if [ -f tsconfig.json ]; then npm run build; fi

# Espone la porta (modifica se usi una porta diversa)
EXPOSE 3000

# Comando di avvio per ambiente di sviluppo React
CMD ["npm", "run", "start"]
