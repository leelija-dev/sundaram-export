FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL=http://localhost/api/v1
ARG NEXT_PUBLIC_MEDIA_ORIGIN=http://localhost
ARG NEXT_PUBLIC_SITE_EMAIL=exports@sundaramexport.com
ARG NEXT_PUBLIC_SITE_PHONE=+91 22 4000 1200
ARG NEXT_PUBLIC_SITE_PHONE_ALT=+1 (713) 555 0142
ARG NEXT_PUBLIC_SITE_ADDRESS=Sundaram Trade Tower, Bandra Kurla Complex, Mumbai 400051, India
ARG NEXT_PUBLIC_SITE_ADDRESS_SHORT=Mumbai, India
ARG NEXT_PUBLIC_SITE_ADDRESS_US=2400 Port Commerce Parkway, Houston, TX 77029, USA
ARG NEXT_PUBLIC_SITE_FOUNDED_YEAR=1998

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_MEDIA_ORIGIN=$NEXT_PUBLIC_MEDIA_ORIGIN \
    NEXT_PUBLIC_SITE_EMAIL=$NEXT_PUBLIC_SITE_EMAIL \
    NEXT_PUBLIC_SITE_PHONE=$NEXT_PUBLIC_SITE_PHONE \
    NEXT_PUBLIC_SITE_PHONE_ALT=$NEXT_PUBLIC_SITE_PHONE_ALT \
    NEXT_PUBLIC_SITE_ADDRESS=$NEXT_PUBLIC_SITE_ADDRESS \
    NEXT_PUBLIC_SITE_ADDRESS_SHORT=$NEXT_PUBLIC_SITE_ADDRESS_SHORT \
    NEXT_PUBLIC_SITE_ADDRESS_US=$NEXT_PUBLIC_SITE_ADDRESS_US \
    NEXT_PUBLIC_SITE_FOUNDED_YEAR=$NEXT_PUBLIC_SITE_FOUNDED_YEAR

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
