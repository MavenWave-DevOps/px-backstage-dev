# [Mayo Backstage](https://backstage.io)

This repository is for development of Backstage for the Mayo Common Control Plane Migration.

---

## 📝 Table of Contents

- [Requirements](#requirements)
- [Getting Started](#getting_started)
- [Built Using](#built_using)
- [CI/CD](#cicd)
- [Authors](#authors)

## ⚓ Requirements <a name = "requirements"></a>

- node version `v16.20.0`
- yarn version `1.22.19`

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

## 🚀 CI/CD <a name = "cicd"></a>
The main branch is connected to Google Cloud Build CI/CD pipeline and argocd image updater.

## ⛏️ Built Using <a name = "built_using"></a>

- [Node.js](https://nodejs.org/en/docs/) - Backstage is ran on Node.js
- [ReactJS](https://reactjs.org/) - Typescript Frontend library

## ✍️ Authors <a name = "authors"></a>

- [@fosterm-mw](https://github.com/fosterm-mw) 
