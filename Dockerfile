FROM node:22-alpine AS builder

WORKDIR /app

RUN npm config set registry https://registry.npmjs.org/ \
    && npm install -g pnpm@11.13.1 --fetch-retries=10 --fetch-timeout=600000

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile --registry=https://registry.npmjs.org/ --network-concurrency=1 --fetch-retries=10 --fetch-timeout=600000

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_API_VERSION

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_API_VERSION=${VITE_API_VERSION}

RUN pnpm build


FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]