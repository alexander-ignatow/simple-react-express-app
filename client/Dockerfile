FROM node:24-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci && chown -R node:node /app

FROM dependencies AS development

COPY --chown=node:node . .

USER node

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

FROM dependencies AS build

ARG VITE_API_URL
ARG VITE_API_TOKEN

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_API_TOKEN=${VITE_API_TOKEN}

COPY . .
RUN npm run build

FROM nginx:1.29-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
