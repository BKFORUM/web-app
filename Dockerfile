FROM node:18-alpine as BUILD_IMAGE

WORKDIR /app/react-app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

FROM node:18-alpine as PRODUCTION_IMAGE
WORKDIR /app/react-app

COPY --from=BUILD_IMAGE /app/react-app/dist/ /app/react-app/dist/

COPY package*.json ./
COPY vite.config.ts ./
RUN npm install --legacy-peer-deps

EXPOSE 4173

CMD ["npm", "run", "preview"]