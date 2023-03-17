# [Mayo Backstage](https://backstage.io)

This repository is for development of Backstage for the Mayo Common Control Plane Migration.

---

## 📝 Table of Contents

- [Getting Started](#getting_started)
- [Built Using](#built_using)
- [CI/CD](#cicd)
- [Authors](#authors)

## 🏁 Getting Started <a name = "getting_started"></a>

Only do the following if you have env vars for SSO and authentication
  - Secret values can be found in GCP console secret manager.
Set env vars:
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
