FROM node:18-alpine

#nodemon is for dev
RUN npm install -g nodemon
EXPOSE 3001
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]