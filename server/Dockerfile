FROM node:24-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci && chown -R node:node /app

FROM dependencies AS development

COPY --chown=node:node . .

USER node

EXPOSE 3001

CMD ["npm", "run", "dev"]

FROM dependencies AS build

COPY . .
RUN npm run build

FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force && chown -R node:node /app

COPY --from=build --chown=node:node /app/dist ./dist

USER node

EXPOSE 3001

CMD ["node", "dist/index.js"]
