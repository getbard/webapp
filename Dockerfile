########
## Build
########
FROM node:14-alpine AS builder
WORKDIR /build

# Set release in env
ARG RELEASE
ENV RELEASE=$RELEASE

# Install dependencies
COPY . ./
RUN yarn --frozen-lockfile

# Build the project
RUN yarn build && rm -rf .next/cache


########
## Run
########
FROM node:14-alpine
WORKDIR /usr/src/app

# Set release in env
ARG RELEASE
ENV RELEASE=$RELEASE

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn --production --frozen-lockfile

COPY --from=builder /build/.next .next
COPY --from=builder /build/generated generated
COPY public public
COPY .env .env

# Disable telemetry
RUN npx next telemetry disable

CMD [ "yarn", "start:production" ]