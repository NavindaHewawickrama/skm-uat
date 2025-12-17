#base image where alphine is a smaller version of linux
FROM node:18-alpine AS base

#dependency handling using base image
FROM base AS deps

#compatibility with ceratin native packages
RUN apk add --no-cache libc6-compat
#working directory
WORKDIR /app

#copying package.json and lock file
COPY package.json package-lock.json ./
RUN npm ci

#building the app using dependencies
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

#finsih building stage
RUN npm run build

#stage where the application runs in productino
FROM base AS runner
WORKDIR /app

#makes sure the app runs in production mode
ENV NODE_ENV production
ENV NEXT_PUBLIC_API_BASE_URL=http://10.0.2.10

#group for permissions 
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

#run the next js app under non root user
#copy the public from builder stage
COPY --from=builder /app/public ./public

#a folder to hold our next js build file
RUN mkdir .next
#ensureing proper permissions
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

#next js app will run on port 3000
EXPOSE 3000

ENV PORT 3000

CMD HOSTNAME="0.0.0.0" node server.js



# docker image build -t skm-frontend:latest .  docker build command
# docker container run -p 3000:3000 skm-frontend:latest    docker run command