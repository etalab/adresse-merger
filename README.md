# Plateforme Base Adresse Nationale

Ce dépôt regroupe l'essentiel des briques faisant partie de la plateforme Base Adresse Nationale, à savoir :

- les routines d'import ;
- les routines de consolidation ;
- les routines de production des fichiers ;
- un service "worker" réagissant en temps réel à toute modification.

## Installer un environnement de développement

### Pré-requis

- Node.js 12.x
- MongoDB 4 ou supérieur
- Redis
- yarn ou npm

### Données référentiels

Pour fonctionner certaines routines nécessitent les référentiels "Etalab Gazetteer" et "FANTOIR". Ils peuvent être téléchargés à [cette adresse](http://etalab-datasets.geo.data.gouv.fr/dev-databases/).

### Configuration

Pour mettre en place un environnement fonctionnel, vous pouvez partir du fichier `.env.sample` et le copier en le renommant `.env`.

Compte-tenu de la puissance de calcul nécessaire pour effectuer les traitements sur France entière il est conseiller le restreindre à un seul département pour les développements. Par exemple `DEPARTEMENTS=57`.

### Installation des dépendances

```bash
yarn
```

### Démarrage du service "worker" (alpha)

```bash
yarn worker
```

### Import des différentes sources

```bash
yarn import:bal
yarn import:ign-api-gestion
yarn import:cadastre
yarn import:ftth
```

Une fois les routines d'import terminées il faut attendre que le worker ait re-consolidé toutes les communes impactées.

### Production des fichiers

```bash
yarn dist
```
