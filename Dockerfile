FROM node:lts
WORKDIR /usr/src/app
RUN chmod 777 /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/
COPY . .
RUN npm install
RUN npm install @prisma/client
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
EXPOSE 9229
CMD ["npm", "run", "dev"]