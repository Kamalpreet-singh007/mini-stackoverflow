    FROM node:18 AS builder

    WORKDIR usr/src/app

    COPY package*.json ./
    # COPY package-lock-json ./ 
    RUN npm install

    COPY . .

    EXPOSE 5173

    CMD ["npm", "run", "dev-exposed"]
