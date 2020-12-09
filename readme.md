# TODO LIST API

Une simple API REST exposant des services autour du concept de Todo List, réalisée dans le cadre de l'enseignement du développement d'API REST avec Node.js, implémentées au sein d'architectures Micro Services mises en place avec Docker et consommées par tous types de clients (Web, Mobile...).

![logo Todo List API](./api/assets/to-do-list.png "Logo Todo List API")

## Configuration

- Créer un fichier ./api/.env.dev et un fichier ./api/.env.prod et renseigner les variables d'environnement suivantes : 

    - HOST=http://localhost
    - LOCAL_PORT=3000
    - DIST_PORT=3000
    - NODE_ENV=production
    - DB_HOST=todolist.db
    - DB_NAME=todolist
    - DB_USER=todolist
    - DB_PWD=xxxxxxxxxxx
    - JWT_KEY=xxxxxxxxxx

## Commandes

### Démarrage des services

```
docker-compose up
```

## Crédits

Icons made by Freepik from www.flaticon.com

---

__Alexandre Leroux__

alex@sherpa.one

_Enseignant vacataire à l'Université de Lorraine_

- IUT Nancy-Charlemagne (LP Ciasie)

- Institut des Sciences du Digital (Masters Sciences Cognitives)