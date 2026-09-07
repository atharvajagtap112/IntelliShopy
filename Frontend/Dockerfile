# Stage 1: build the React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# API base URL is baked into the build (CRA inlines REACT_APP_* at build time).
# The browser runs on the host, so it must reach the backend via a host port.
ARG REACT_APP_API_BASE_URL=http://localhost:3333
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
# OAuth handshake goes straight to Primary-Service (gateway can't proxy the redirect_uri host).
ARG REACT_APP_OAUTH_BASE_URL=http://localhost:5454
ENV REACT_APP_OAUTH_BASE_URL=$REACT_APP_OAUTH_BASE_URL
RUN npm run build

# Stage 2: serve static files with nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
