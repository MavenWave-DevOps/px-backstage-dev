# [Mayo Backstage](https://backstage.io)

This repository is for development of Backstage for the Mayo Common Control Plane Migration.

---

## 📝 Table of Contents

- [Requirements](#requirements)
- [Getting Started](#getting_started)
- [Built Using](#built_using)
- [CI/CD](#cicd)
- [Build the Container](#build_the_container)
- [Authors](#authors)

## ⚓ Requirements <a name = "requirements"></a>

- node version `v16.20.0`
- yarn version `1.22.19`
- docker
- rancher desktop

## 🏁 Getting Started <a name = "getting_started"></a>

Source secrets:
```
source env/secrets.sh
```

To start the app, run:

```
yarn install
yarn dev
```
## ⛏️ Built Using <a name = "built_using"></a>

- [Node.js](https://nodejs.org/en/docs/) - Backstage is ran on Node.js
- [ReactJS](https://reactjs.org/) - Typescript Frontend library

## 🚀 CI/CD <a name = "cicd"></a>
The main branch is connected to Google Cloud Build CI/CD pipeline and argocd image updater.

## ⛏️ Build the Container <a name = "build_the_container"></a>
To push code, test the container build locally. First, set the docker buildkit to be true. 
Then run the build command:
```
docker image build -t <tag> .
```
And run the container:
```
docker run -it -p 7007:7007 <tag>
```
To stop the docker container run in another terminal:
```
docker ps
docker stop <Container ID>
```
Documentation: https://backstage.io/docs/deployment/docker/

## ✍️ Authors <a name = "authors"></a>

- [@fosterm-mw](https://github.com/fosterm-mw) 
