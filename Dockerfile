FROM node:16.20.0-alpine

WORKDIR /app

COPY backend/package.json backend/package.json
RUN cd backend; npm install

COPY frontend/package.json frontend/package.json
RUN cd frontend; npm install

COPY backend/tsconfig.json backend/
COPY backend/src backend/src
RUN cd backend; npm run-script build

COPY frontend/tsconfig.json frontend/tsconfig.node.json frontend/vite.config.ts frontend/index.html frontend/
COPY frontend/public frontend/public
COPY frontend/src frontend/src
RUN cd frontend; npm run-script build

VOLUME [ "/config" ]
ENV CONFIG_DIR=/config
ENV LISTENING_PORT=8080
ENV BYPASS_LOGIN=0

EXPOSE 8080
ENTRYPOINT [ "node", "backend/dist/app.js" ]
