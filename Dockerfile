# #base image where alphine is a smaller version of linux
# FROM node:18-alpine AS base

# #dependency handling using base image
# FROM base AS deps

# #compatibility with ceratin native packages
# RUN apk add --no-cache libc6-compat
# #working directory
# WORKDIR /app

# #copying package.json and lock file
# COPY package.json package-lock.json ./
# RUN npm ci

# #building the app using dependencies
# FROM base AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# #finsih building stage
# RUN npm run build

# #stage where the application runs in productino
# FROM base AS runner
# WORKDIR /app

# #makes sure the app runs in production mode
# ENV NODE_ENV production
# ENV NEXT_PUBLIC_API_BASE_URL=http://10.0.2.10:8080

# #group for permissions 
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# #run the next js app under non root user
# #copy the public from builder stage
# COPY --from=builder /app/public ./public

# #a folder to hold our next js build file
# RUN mkdir .next
# #ensureing proper permissions
# RUN chown nextjs:nodejs .next

# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# USER nextjs

# #next js app will run on port 3000
# EXPOSE 3000

# ENV PORT 3000

# CMD HOSTNAME="0.0.0.0" node server.js



# # docker image build -t skm-frontend:latest .  docker build command
# # docker container run -p 3000:3000 skm-frontend:latest    docker run command

# Base image where alpine is a smaller version of linux
FROM node:18-alpine AS base

# Dependency handling using base image
FROM base AS deps

# Compatibility with certain native packages
RUN apk add --no-cache libc6-compat
# Working directory
WORKDIR /app

# Copying package.json and lock file
COPY package.json package-lock.json ./
RUN npm ci

# Building the app using dependencies
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Finish building stage
RUN npm run build

# Stage where the application runs in production
FROM base AS runner
WORKDIR /app

# Install libcap for setting capabilities
RUN apk add --no-cache libcap

# Makes sure the app runs in production mode
ENV NODE_ENV production
ENV NEXT_PUBLIC_API_BASE_URL=http://10.0.2.10:8080

# Group for permissions 
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Run the Next.js app under non-root user
# Copy the public from builder stage
COPY --from=builder /app/public ./public

# A folder to hold our Next.js build file
RUN mkdir .next
# Ensuring proper permissions
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Grant CAP_NET_BIND_SERVICE capability to node binary
# This allows binding to ports < 1024 (like port 80) without root
RUN setcap 'cap_net_bind_service=+ep' /usr/local/bin/node

USER nextjs

# Next.js app will run on port 80
EXPOSE 80

ENV PORT 80

# Set host to listen on all interfaces
CMD HOSTNAME="0.0.0.0" node server.js