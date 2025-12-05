FROM node:24-bullseye-slim AS build

ADD . .
RUN npm install
RUN npm run build

# Create multi-stage build to reduce image size
FROM node:24-bullseye-slim
WORKDIR /app
# Create non-root user
RUN groupadd -g 999 appuser && useradd -u 999 -g appuser appuser
COPY --from=build package.json .
COPY --from=build node_modules ./node_modules
COPY --from=build dist ./dist
# Change ownership to non-root user
RUN chown -R appuser:appuser /app
# Switch to non-root user
USER appuser

CMD ["npm", "start"]