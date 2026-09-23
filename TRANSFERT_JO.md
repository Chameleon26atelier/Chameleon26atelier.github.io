# Chameleon26 Atelier — copie pour Jo

Ce dossier contient la version complète du site avec :

- la galerie publique ;
- les 11 créations et leurs prix de départ ;
- le formulaire de demande par e-mail ;
- l’espace d’administration `/admin` ;
- l’ajout, la modification et la suppression des créations ;
- l’envoi de nouvelles photos ;
- le stockage D1 et R2 nécessaire à l’administration.

## Consigne de publication

Créer un **nouveau Site** sur le compte ChatGPT de Jo à partir de cette branche. Ne pas rattacher cette copie au projet existant de Didier et ne pas réutiliser un ancien `project_id`.

Lors de la création du Site :

1. conserver les déclarations D1 `DB` et R2 `BUCKET` de `.openai/hosting.json` ;
2. appliquer les migrations du dossier `drizzle/` dans leur ordre ;
3. créer la variable d’environnement `ADMIN_EMAILS` avec l’adresse utilisée pour la connexion ChatGPT de Jo ;
4. publier le site en accès public ;
5. vérifier la page `/admin` avec le compte de Jo ;
6. confirmer la nouvelle adresse publique et l’adresse `/admin`.

## Message à donner au ChatGPT de Jo

> Ouvre le dépôt GitHub `Chameleon26atelier/Chameleon26atelier.github.io` sur la branche `site-complet-admin`. Crée un nouveau Site sur mon compte à partir de cette version complète. Conserve la galerie et l’espace `/admin`, crée les ressources D1 et R2 déclarées, applique les migrations et configure `ADMIN_EMAILS` avec l’adresse de mon compte ChatGPT sans l’écrire dans le dépôt. Publie le nouveau site en accès public et donne-moi l’adresse du site ainsi que l’adresse d’administration. Ne modifie pas la branche `main` ni le site GitHub Pages existant.
