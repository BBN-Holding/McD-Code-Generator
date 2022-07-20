FROM node:18
WORKDIR /app/
COPY ./ ./
RUN npm install

CMD ["npx","ts-node","index.ts"]

