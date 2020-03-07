# 设置基础镜像,如果本地没有该镜像，会从Docker.io服务器pull镜像
FROM node

# 设置时区
ENV TIME_ZONE=Asia/Shanghai

# # 设置时区
# RUN apk --update add tzdata \
#   && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
#   && echo "Asia/Shanghai" > /etc/timezone \
#   && apk del tzdata


# 在容器内运行命令
RUN \
  mkdir -p /usr/src/node-app/tracking \
  && apk add --no-cache tzdata \
  && echo "${TIME_ZONE}" > /etc/timezone \ 
  && ln -sf /usr/share/zoneinfo/${TIME_ZONE} /etc/localtime 

# # 创建app目录
# RUN mkdir -p /node-app/tracking

# 设置工作目录
WORKDIR /usr/src/node-app/tracking

# 拷贝package.json文件到工作目录
# !!重要：package.json需要单独添加。
# Docker在构建镜像的时候，是一层一层构建的，仅当这一层有变化时，重新构建对应的层。
# 如果package.json和源代码一起添加到镜像，则每次修改源码都需要重新安装npm模块，这样木有必要。
# 所以，正确的顺序是: 添加package.json；安装npm模块；添加源代码。
COPY package.json /usr/src/node-app/tracking/package.json

# 安装npm依赖(使用淘宝的镜像源)
# 如果使用的境外服务器，无需使用淘宝的镜像源，即改为`RUN npm i`。
RUN npm i --registry=https://registry.npm.taobao.org

# 拷贝所有源代码到工作目录
COPY . /usr/src/node-app/tracking

# 暴露端口。如果程序是一个服务器，会监听一个或多个端口，可以用 EXPOSE 来表示这个端口
EXPOSE 8001

# 启动node应用
CMD npm start
