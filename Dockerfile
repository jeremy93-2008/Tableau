FROM node:lts
WORKDIR /usr/src/app
RUN chmod 777 /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/
COPY . .
RUN npm install
RUN npm install @prisma/client
RUN npm run build
RUN npx prisma generate --schema=prisma/schema.docker.prisma 
EXPOSE 3000
EXPOSE 9229
CMD ["npm", "run", "dev"]