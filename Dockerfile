FROM node:lts
WORKDIR /usr/src/app
RUN chmod 777 /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/
COPY . .
RUN npm install
RUN npm run prisma:docker:generate
RUN npm run build
EXPOSE 3000
EXPOSE 9229
CMD ["npm", "run", "docker:dev"]