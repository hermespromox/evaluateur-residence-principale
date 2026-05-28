# Évaluateur Résidence Principale — V1

Application frontend uniquement pour évaluer objectivement une résidence principale.

## V1 inclut

- Formulaire par critères avec listes déroulantes
- Score global normalisé sur 100
- Détail par catégorie
- Gestion “Non applicable” avec exclusion du dénominateur
- Notes personnelles facultatives par critère
- Liste des critères à 0 point
- Réinitialisation
- Export PDF simple via impression navigateur

## Stack

- React
- Vite
- TypeScript
- CSS custom basé sur le design system warm/orange

## Lancer localement

```bash
npm install
npm run dev
```

## Modifier le barème

Tout le scoring est centralisé dans `src/App.tsx`, constante `criteria`.
