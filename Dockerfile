FROM node:18
WORKDIR /app/
COPY ./ ./
RUN npm i

CMD ["npx","ts-node","index.ts"]