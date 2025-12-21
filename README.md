# Bright Consulting – Serveur (Next.js + Prisma)

Ce dépôt contient l’API et la documentation de Bright Consulting, basée sur Next.js (App Router) et Prisma (PostgreSQL). L’API expose des endpoints d’administration (sécurisés par session + permissions) et génère automatiquement une documentation OpenAPI consultable via Swagger UI.

## Sommaire

- Prérequis
- Installation & Configuration
- Démarrage & Scripts NPM
- Fonctionnement (Architecture, Auth, Permissions)
- Documentation API (OpenAPI / Swagger)
- Base de données & Prisma (Migrations)
- Déploiement (Production)
- Intégrations (exemples d’utilisation)
- Structure du projet

---

## Prérequis

- Node.js 18+ (recommandé Node 20 LTS)
- NPM ou Yarn/PNPM (NPM par défaut)
- Une base PostgreSQL accessible (localement ou managée)

Variables d’environnement minimales à définir :

- `DATABASE_URL`: chaîne de connexion PostgreSQL (par ex. `postgresql://user:password@localhost:5432/bright_db?schema=public`)

Créez un fichier `.env` dans `server/` pour centraliser la configuration locale :

```
# server/.env
DATABASE_URL="postgresql://user:password@localhost:5432/bright_db?schema=public"
NODE_ENV=development
```

> Remarque: l’authentification utilise un cookie `sessionId`. Aucune clé secrète supplémentaire n’est requise par défaut dans ce dépôt.

---

## Installation & Configuration

1) Installer les dépendances côté serveur :

```
cd server
npm install
```

2) Préparer la base de données via Prisma :

```
# Appliquer les migrations locales
npx prisma migrate dev

# (Optionnel) Générer le client Prisma si nécessaire
npx prisma generate
```

> Des migrations existent dans `server/prisma/migrations/`. Assurez-vous que `DATABASE_URL` pointe vers une base disponible.

3) (Optionnel) Seed de données

Le script `npm run seed` référence `ts-node prisma/seed/index.ts`. Si le fichier de seed n’est pas présent, créez-le au besoin ou ignorez cette étape.

---

## Démarrage & Scripts NPM

Dans `server/package.json` :

- `npm run dev` : lance Next.js en mode développement (http://localhost:3000)
- `npm run build` : build de production
- `npm run start` : démarre le serveur en production (nécessite un build préalable)
- `npm run lint` : exécute ESLint
- `npm run seed` : exécute le script de seed (si présent)

Exemples :

```
# Dev
npm run dev

# Production locale
npm run build
npm run start
```

---

## Fonctionnement

### Architecture

- Framework : Next.js 16 (App Router)
- Langage : TypeScript / React 19
- ORM : Prisma 7 (client généré dans `server/app/generated/prisma`)
- DB : PostgreSQL
- Validation : Zod (et zod-to-openapi pour la doc)
- UI de documentation : Swagger UI via `server/app/docs/page.tsx`

Points d’entrée notables :

- Santé/accueil API : `GET /api` → « Welcome to Bright Consulting API »
- Documentation JSON OpenAPI : `GET /api/docs`
- Swagger UI : `GET /docs`

### Authentification & Sessions

- Une session est créée côté serveur et identifiée par un cookie `sessionId`
- Récupération utilisateur courant dans `server/app/api/admin/_core/auth.ts`
- Les routes admin exigent un utilisateur authentifié

### Permissions (RBAC)

- Les permissions sont portées par des rôles et contrôlées via `requirePermission` (`server/app/api/admin/_core/guard.ts`)
- Exemple : pour accéder aux ressources `visa_par_pays`, l’utilisateur doit posséder l’action `view`/`create`/`update`/`delete` selon l’opération

---

## Documentation API (OpenAPI / Swagger)

La spécification est générée dynamiquement via `server/lib/openapi.ts` en s’appuyant sur les schémas Zod des endpoints (ex. `server/app/api/admin/**/schema.ts`).

- Spéc OpenAPI (JSON) : `GET /api/docs`
- Interface Swagger : `GET /docs`

Les chemins sont regroupés par tags, ex. `Admin/Pays`, `Admin/TypeVisa`, `Admin/Promotions`, etc. Les endpoints d’admin requièrent une session valide (cookie `sessionId`).

---

## Base de données & Prisma

- Schéma Prisma : `server/prisma/schema.prisma`
- Modèles principaux : `Pays`, `TypeVisa`, `VisaParPays`, `Promotions`, `OffreEmploi`, `CoursLangue`, `SectionHoraire`, `FiliereEtude`, `AvisVoyageur`, `User`, `Role`, `Permission`, etc.
- Adapter Prisma PG : `server/lib/prisma.ts` attend `DATABASE_URL`

Commandes usuelles :

```
# Créer une nouvelle migration après modification du schéma
npx prisma migrate dev --name <nom_migration>

# Déployer les migrations en prod
npx prisma migrate deploy

# Explorer la base (studio)
npx prisma studio
```

---

## Déploiement (Production)

Exigences :

- Variable `DATABASE_URL` pointant vers une base PostgreSQL accessible depuis l’environnement de déploiement
- Build Next.js puis exécution serveur

Pipeline type :

```
cd server
npm ci
npx prisma migrate deploy
npm run build
npm run start
```

Notes :

- Les routes API s’exécutent côté serveur (Next.js App Router).
- Le cookie `sessionId` est `httpOnly`. Prévoyez un domaine/chemin corrects si vous avez un front séparé.
- Mettez à jour la propriété `servers` dans l’OpenAPI si vous exposez un domaine public (voir `server/lib/openapi.ts`).

---

## Intégrations (Exemples)

### Exemple: Récupération de la spec OpenAPI

```
curl http://localhost:3000/api/docs
```

### Exemple: Accès à une route d’admin (protégée)

Les routes d’admin exigent une session valide :

```
# Exemple GET visa_par_pays (après authentification)
curl -H "Cookie: sessionId=<votre_session>" \
  http://localhost:3000/api/admin/visa-par-pays
```

Pour créer/mettre à jour, reportez-vous aux schémas Zod (ex. `server/app/api/admin/visa-par-pays/schema.ts`).

---

## Structure du projet

```
server/
  app/
    api/
      route.ts                 # GET /api (accueil)
      docs/route.ts            # GET /api/docs (OpenAPI JSON)
      admin/
        _core/                 # auth, guard (permissions)
        visa-par-pays/         # endpoints + schema Zod
        ...
    docs/page.tsx              # Swagger UI (GET /docs)
    generated/prisma/          # client Prisma généré
  lib/
    openapi.ts                 # registre et génération OpenAPI
    prisma.ts                  # client Prisma (adapter PG)
    zod.ts                     # extension OpenAPI
  prisma/
    schema.prisma
    migrations/
  package.json
  tsconfig.json
  ...
```

---

## Support

En cas de question ou de bug, ouvrez une issue GitHub sur le dépôt ou pingez l’équipe technique Bright Consulting.

