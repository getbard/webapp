########
## Build
########
FROM node:12-alpine AS builder
WORKDIR /build

# Install dependencies
COPY . ./
RUN yarn

# Build the project
RUN yarn build && rm -rf .next/cache


########
## Run
########
FROM node:12-alpine
WORKDIR /usr/src/app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn --production

COPY --from=builder /build/.next .next
COPY --from=builder /build/generated generated
COPY public public
COPY .env .env

# Disable telemetry
RUN npx next telemetry disable

CMD [ "yarn", "start:production" ]