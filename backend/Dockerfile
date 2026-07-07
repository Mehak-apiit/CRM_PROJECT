FROM node:18

WORKDIR /app

# root package.json copy करो
COPY ../package*.json ./

RUN npm install

# पूरा project copy करो
COPY .. .

WORKDIR /app/backend

EXPOSE 5000

CMD ["node", "server.js"]

