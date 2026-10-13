# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---------- Build ----------
FROM base AS build
COPY . .
RUN npm run build

# ---------- Production Image ----------
FROM node:20-alpine AS production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/uploads ./uploads

ENV NODE_ENV=prod
EXPOSE 3000

CMD ["sh", "-c", "NODE_ENV=prod npm run migration:run && NODE_ENV=prod node dist/main.js"]
# command: sh -c "npm run migration:run:stg && node dist/main.js"
# CMD ["node", "dist/main.js"]
