# Recommended reading for secondary development [How to improve project build efficiency](https://developers.weixin.qq.com/miniprogram/dev/wxcloudrun/src/scene/build/speed.html)
FROM node:18-bullseye-slim

# The default time zone of the container is UTC. If you need to use Shanghai time, please enable the following time zone setting command
# RUN apk add tzdata && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo Asia/Shanghai > /etc/timezone

# Use HTTPS protocol to access the container cloud call certificate installation
RUN apt-get update && apt-get install -y ca-certificates

# # Install dependency packages. If you need other dependency packages, please go to the alpine dependency package management (https://pkgs.alpinelinux.org/packages?name=php8*imagick*&branch=v3.13) to find them.
# # Use domestic mirror sources to improve download speed
# RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tencent.com/g' /etc/apk/repositories \
# && apk add --update --no-cache nodejs npm

# # Install dependencies
# RUN apt-get update && apt-get install -y \
#     wget \
#     gnupg \
#     libxshmfence1 \
#     libnss3 \
#     libfreetype6 \
#     libharfbuzz0b \
#     ca-certificates \
#     fonts-freefont-ttf \
#     --no-install-recommends

# Download and install Microsoft Edge
# RUN wget -q -O - https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /usr/share/keyrings/microsoft-archive-keyring.gpg
# RUN echo "deb [signed-by=/usr/share/keyrings/microsoft-archive-keyring.gpg] https://packages.microsoft.com/repos/edge stable main" > /etc/apt/sources.list.d/microsoft-edge.list
# RUN apt-get update \
# RUN apt-get install -y microsoft-edge-stable

# Set the path for Puppeteer to use Edge
# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/microsoft-edge

# # Specify the working directory
WORKDIR /app

# Copy package management files
COPY package*.json /app/

# npm source, use domestic mirror sources to improve download speed
RUN npm config set registry https://mirrors.cloud.tencent.com/npm/
# RUN npm config set registry https://registry.npm.taobao.org/

# npm install dependencies
RUN npm i

# Copy all files in the current directory (where the dockerfile is located) to the working directory (excluding files in .dockerignore)
COPY . ./

RUN npm run build && npm run copy-html

# Execute the startup command
# Writing multiple independent CMD commands is incorrect! Only the last CMD command will be executed, and the previous ones will be ignored, causing business errors.
# Please refer to [Docker official documentation on CMD command](https://docs.docker.com/engine/reference/builder/#cmd)
CMD [ "node", "dist/index.js" ]
