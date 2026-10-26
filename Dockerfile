# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS builder

WORKDIR /app

ENV PNPM_MANAGE_PACKAGE_MANAGER_VERSIONS=false

RUN npm install -g pnpm@11.13.1 \
    --registry=https://registry.npmjs.org/

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,id=hamiyar-pnpm,target=/pnpm/store \
    pnpm install \
    --frozen-lockfile \
    --store-dir=/pnpm/store \
    --registry=https://registry.npmjs.org/ \
    --network-concurrency=4 \
    --fetch-retries=3 \
    --fetch-timeout=120000

COPY . .

ARG VITE_API_BASE_URL=https://hamiyar.kaic.karaj.iau.ir
ARG VITE_API_VERSION

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_VERSION=${VITE_API_VERSION}

RUN pnpm build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]