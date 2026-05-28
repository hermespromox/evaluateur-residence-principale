# Scory — Évaluateur Résidence Principale

Scory transforme une visite immobilière en décision objectivée : score sur 100, détail par catégorie, alertes à 0 point et demande de conseil.

## Produit

- Landing SaaS complète : hero, valeur, process, pricing, témoignages, FAQ, CTA
- Formulaire d’évaluation avec 28 critères
- Score global normalisé sur 100
- Gestion “Non applicable” avec exclusion du dénominateur
- Notes personnelles facultatives
- Export PDF navigateur
- Formulaire contact connecté à `/api/contact` via Resend

## Stack

- React
- Vite
- TypeScript
- Vercel Serverless Function
- Resend

## Local

```bash
npm install
npm run dev
```

## Env production

- `RESEND_API_KEY` requis pour l’envoi email
- `CONTACT_TO_EMAIL` optionnel, défaut : `hermes.promox@gmail.com`
