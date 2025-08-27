FROM node:18-alpine AS build
ARG NEXT_PUBLIC_REST_API_ENDPOINT
ENV NEXT_PUBLIC_REST_API_ENDPOINT=$NEXT_PUBLIC_REST_API_ENDPOINT

ARG NEXT_PUBLIC_WEBSITE_URL
ENV NEXT_PUBLIC_WEBSITE_URL=$NEXT_PUBLIC_WEBSITE_URL

ARG NEXT_PUBLIC_ADMIN_URL
ENV NEXT_PUBLIC_ADMIN_URL=$NEXT_PUBLIC_ADMIN_URL

ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY . .

RUN yarn next telemetry disable
RUN yarn build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/next.config.js ./

EXPOSE 3000
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node", "server.js"]
