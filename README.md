# Billed
## Débuggez et testez un SaaS RH
------------
### Description du projet
Ce projet consiste à débugger et tester un SaaS RH.
### Cahiers des charges
##### Spécifications techniques
1. Fixer les bugs.
2. Ajouter des tests unitaires et d'intégration.
3. Rédiger un plan de test End-to-End.

### Compétences acquises
- Ecrire des tests unitaires avec JavaScript
- Débugger une application web avec le Chrome Debugger
- Rédiger un plan de test end-to-end manuel
- Ecrire des tests d'intégration avec JavaScript

### Informations complémentaires
- Soutenance validé le : 25/04/2024

#### Livrable
##### Points forts :

- bon projet, les attentes sont satisfaites

#### Soutenance
##### Remarques :

- bonne présentation
- le support de présentation a permis de suivre facilement le déroulé.
- Le sujet est compris 

### Comment lancer l'application en local ?

#### étape 1 - Lancer le backend :

Suivez les indications dans le README du projet backend.

##### Lancer l'API :

```
npm run run:dev
```
##### Accéder à l'API :

L'api est accessible sur le port `5678` en local, c'est à dire `http://localhost:5678`

#### étape 2 - Lancer le frontend :

Suivez les indications dans le README du projet frontend.

##### Lancez l'application :

```
$ live-server
```

Puis allez à l'adresse : `http://127.0.0.1:8080/`


### Comment lancer tous les tests en local avec Jest ?

```
$ npm run test
```

### Comment lancer un seul test ?

Installez jest-cli :

```
$npm i -g jest-cli
$jest src/__tests__/your_test_file.js
```

### Comment voir la couverture de test ?

`http://127.0.0.1:8080/coverage/lcov-report/`

### Comptes et utilisateurs :

Vous pouvez vous connecter en utilisant les comptes:

#### administrateur : 
```
utilisateur : admin@test.tld 
mot de passe : admin
```
#### employé :
```
utilisateur : employee@test.tld
mot de passe : employee
```