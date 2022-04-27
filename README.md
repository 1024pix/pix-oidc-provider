# PIX-OIDC-PROVIDER

Serveur permettant de simuler un fournisseur d'identité OIDC.

## Installation

### 1 - Cloner le repository

- avec `git`

```shell
git clone https://github.com/1024pix/pix-oidc-provider.git
```

- avec `gh`

```shell
gh repo clone 1024pix/pix-oidc-provider.git
```

### 2 - Installer les dépendances

```shell
npm ci
```

Le fichier `sample.env` sera copié vers `.env` à la fin de l'installation des dépendances.

### 3 - Ouvrir le fichier `.env` et configurer les variables

### 4 - Lancer le serveur

```shell
npm start
```

### 5 - Accéder au fournisseur d'identité OIDC

```shell
open -u http://<HOST>:<PORT>/auth?client_id=<CLIENT_ID>&client_secret=<CLIENT_SECRET>&response_type=code&scope=<SCOPE>&nonce=<NONCE>&redirect_uri=<REDIRECT_URI>
```
