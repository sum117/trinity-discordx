## build runner
FROM node:lts-alpine as build-runner

# Set temp directory
WORKDIR /tmp/app

# Move package.json
COPY package.json .

RUN apk add --no-cache --virtual .build-deps make gcc g++ python3 git && \
    npm install && \
    apk del .build-deps
RUN npm install

# Move source files
COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json   .

# Build project
RUN npm run build

## producation runner
FROM node:lts-alpine as prod-runner

# Set work directory
WORKDIR /app

# Copy package.json from build-runner
COPY --from=build-runner /tmp/app/package.json /app/package.json

# Install dependencies
RUN apk add --no-cache --virtual .build-deps make gcc g++ python3 git && \
    npm install && \
    apk del .build-deps
RUN npm install --only=production

# Move build files
COPY src/util/Roboto-Regular.ttf /app/build/src/util/
COPY --from=build-runner /tmp/app/prisma/schema.prisma /app/prisma/
COPY --from=build-runner /tmp/app/build /app/build

# Start bot
CMD [ "npm", "run", "start" ]
