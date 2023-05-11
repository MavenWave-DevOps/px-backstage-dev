# [Mayo Backstage](https://backstage.io)

This repository is for development of Backstage for the Mayo Common Control Plane Migration.

---

## 📝 Table of Contents

- [Requirements](#requirements)
- [Getting Started](#getting_started)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Build the Container](#build_the_container)
- [Built Using](#built_using)
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

## 🧪 Testing <a name = "testing"></a>
To develop on this repository, you must write a test for any plugin and run the code against the tests.
See example plugin for an example test to run.
Local testing run:
```
yarn backstage-cli repo test
```
TODO - This repository is set up with an action to test and will fail if any new components do not pass the tests.

## 🚀 CI/CD <a name = "cicd"></a>
The main branch is connected to Google Cloud Build CI/CD pipeline and argocd image updater.

## 🏗️ Build the Container <a name = "build_the_container"></a>
To push code, test the container build locally. First, set the docker buildkit to be true. 
**Follow these [docs](./documentation/local-postgresql.md) to run the conatiners for postgresql configuration.**

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

## ⛏️ Built Using <a name = "built_using"></a>

- [Node.js](https://nodejs.org/en/docs/) - Backstage is ran on Node.js
- [ReactJS](https://reactjs.org/) - Typescript Frontend library

## ✍️ Authors <a name = "authors"></a>

- [@fosterm-mw](https://github.com/fosterm-mw) 
