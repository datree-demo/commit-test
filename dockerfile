FROM nexus.example.com:18443/ubuntu
FROM python
WORKDIR /usr/src/app
COPY package.json .
ARG NPM_TOKEN
RUN npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN
RUN npm install
COPY . .
EXPOSE 8000
CMD [ "npm", "start" ]
