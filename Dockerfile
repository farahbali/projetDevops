FROM node:17-alpine AS production

WORKDIR /app

COPY . .

RUN npm install

RUN npm install -g http-server nodemon

# Expose both ports
# port for apis
EXPOSE 3000
# port for html page
EXPOSE 5500

CMD ["npm", "run", "dev"]
