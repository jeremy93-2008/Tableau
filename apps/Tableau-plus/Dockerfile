FROM node:alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /monorepo
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=tableau-plus --docker

FROM node:lts AS installer
WORKDIR /monorepo
COPY .gitignore .gitignore
COPY --from=builder /monorepo/out/json/ ./
RUN npm install

COPY --from=builder /monorepo/out/full/ ./
COPY turbo.json turbo.json
RUN npm install -g turbo
RUN turbo prisma:docker:generate
RUN turbo run build --filter=tableau-plus

FROM node:lts AS runner

WORKDIR /monorepo
RUN npm install -g turbo
COPY --from=installer /monorepo ./

WORKDIR /monorepo

EXPOSE 8080
ENTRYPOINT ["turbo", "run", "docker:dev", "--filter=tableau-plus"]