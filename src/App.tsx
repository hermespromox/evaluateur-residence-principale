import { useMemo, useState } from 'react';

type Option = { label: string; points: number; na?: boolean };
type Criterion = { id: string; category: string; name: string; max: number; options: Option[] };

const criteria: Criterion[] = [
  { id: 'workTime', category: 'Vie quotidienne & accessibilité', name: 'Temps domicile → travail principal', max: 6, options: [{ label: '< 20 min', points: 6 }, { label: '20-35 min', points: 4 }, { label: '35-50 min', points: 2 }, { label: '> 50 min', points: 0 }, { label: 'Non applicable', points: 0, na: true }] },
  { id: 'transport', category: 'Vie quotidienne & accessibilité', name: 'Distance transport en commun', max: 5, options: [{ label: '< 5 min à pied', points: 5 }, { label: '5-10 min', points: 4 }, { label: '10-15 min', points: 2 }, { label: '> 15 min', points: 0 }, { label: 'Non applicable', points: 0, na: true }] },
  { id: 'shops', category: 'Vie quotidienne & accessibilité', name: 'Distance commerces du quotidien', max: 4, options: [{ label: '< 5 min à pied', points: 4 }, { label: '5-10 min', points: 2 }, { label: '> 10 min', points: 0 }] },
  { id: 'health', category: 'Vie quotidienne & accessibilité', name: 'Distance médecin ou pharmacie', max: 3, options: [{ label: '< 10 min', points: 3 }, { label: '10-20 min', points: 2 }, { label: '> 20 min', points: 0 }] },
  { id: 'park', category: 'Vie quotidienne & accessibilité', name: 'Distance parc ou espace vert public', max: 2, options: [{ label: '< 5 min', points: 2 }, { label: '5-10 min', points: 1 }, { label: '> 10 min', points: 0 }, { label: 'Non applicable', points: 0, na: true }] },
  { id: 'school', category: 'Vie quotidienne & accessibilité', name: 'Distance école la plus proche', max: 3, options: [{ label: '500 m à 1,5 km', points: 3 }, { label: '1,5 km à 3 km', points: 2 }, { label: '< 300 m ou > 3 km', points: 0 }, { label: 'Non applicable', points: 0, na: true }] },
  { id: 'traffic', category: 'Vie quotidienne & accessibilité', name: 'Niveau de circulation de la rue', max: 4, options: [{ label: '< 5 000 véhicules/jour', points: 4 }, { label: '5 000 à 15 000 véhicules/jour', points: 2 }, { label: '> 15 000 véhicules/jour', points: 0 }, { label: 'Donnée inconnue', points: 0 }] },
  { id: 'internet', category: 'Vie quotidienne & accessibilité', name: 'Connexion internet', max: 3, options: [{ label: 'Fibre > 1 Gb/s', points: 3 }, { label: 'Fibre standard', points: 2 }, { label: 'ADSL seulement', points: 1 }, { label: 'Pas de fibre / débit faible', points: 0 }] },
  { id: 'mortgage', category: 'Budget & charges', name: 'Mensualité crédit / revenus nets foyer', max: 6, options: [{ label: '≤ 25%', points: 6 }, { label: '25-30%', points: 4 }, { label: '30-35%', points: 2 }, { label: '> 35%', points: 0 }] },
  { id: 'tax', category: 'Budget & charges', name: 'Taxe foncière annuelle / prix du bien', max: 4, options: [{ label: '< 1%', points: 4 }, { label: '1-1,5%', points: 2 }, { label: '> 1,5%', points: 0 }] },
  { id: 'hoaFees', category: 'Budget & charges', name: 'Charges copropriété annuelles', max: 4, options: [{ label: '< 15 €/m²/an', points: 4 }, { label: '15-30 €/m²/an', points: 2 }, { label: '> 30 €/m²/an', points: 0 }, { label: 'Non applicable', points: 0, na: true }] },
  { id: 'renovationBeforeMove', category: 'Budget & charges', name: 'Travaux estimés avant emménagement', max: 4, options: [{ label: '< 5% du prix d’achat', points: 4 }, { label: '5-15%', points: 3 }, { label: '15-30%', points: 1 }, { label: '> 30%', points: 0 }] },
  { id: 'purchaseFees', category: 'Budget & charges', name: 'Frais acquisition', max: 2, options: [{ label: '< 8% du prix', points: 2 }, { label: '8-10%', points: 1 }, { label: '> 10%', points: 0 }] },
  { id: 'surface', category: 'Confort du logement', name: 'Surface habitable par occupant', max: 5, options: [{ label: '> 35 m²/personne', points: 5 }, { label: '25-35 m²/personne', points: 3 }, { label: '15-25 m²/personne', points: 1 }, { label: '< 15 m²/personne', points: 0 }] },
  { id: 'bedrooms', category: 'Confort du logement', name: 'Nombre de chambres', max: 4, options: [{ label: 'Suffisant ou supérieur au besoin', points: 4 }, { label: 'Une chambre manquante', points: 2 }, { label: 'Deux chambres ou plus manquantes', points: 0 }] },
  { id: 'orientation', category: 'Confort du logement', name: 'Orientation principale', max: 4, options: [{ label: 'Sud ou Sud-Ouest', points: 4 }, { label: 'Est ou Ouest', points: 2 }, { label: 'Nord', points: 0 }] },
  { id: 'outside', category: 'Confort du logement', name: 'Extérieur privatif', max: 4, options: [{ label: 'Jardin > 50 m²', points: 4 }, { label: 'Terrasse > 10 m²', points: 3 }, { label: 'Balcon', points: 1 }, { label: 'Aucun', points: 0 }] },
  { id: 'sound', category: 'Confort du logement', name: 'Isolation sonore', max: 3, options: [{ label: 'Double vitrage récent partout', points: 3 }, { label: 'Double vitrage partiel ou ancien', points: 1 }, { label: 'Simple vitrage', points: 0 }] },
  { id: 'dpe', category: 'Confort du logement', name: 'DPE', max: 5, options: [{ label: 'A ou B', points: 5 }, { label: 'C', points: 4 }, { label: 'D', points: 2 }, { label: 'E', points: 1 }, { label: 'F ou G', points: 0 }] },
  { id: 'roof', category: 'État technique & travaux', name: 'Toiture / façade / structure', max: 5, options: [{ label: 'Aucun travaux prévus sous 10 ans', points: 5 }, { label: 'Travaux probables sous 5 ans', points: 3 }, { label: 'Travaux nécessaires immédiatement', points: 0 }] },
  { id: 'electricity', category: 'État technique & travaux', name: 'Installation électrique', max: 3, options: [{ label: 'Conforme', points: 3 }, { label: 'Anomalies mineures', points: 2 }, { label: 'Anomalies majeures', points: 0 }] },
  { id: 'plumbing', category: 'État technique & travaux', name: 'Plomberie', max: 2, options: [{ label: 'Aucun problème identifié', points: 2 }, { label: 'Vétusté partielle', points: 1 }, { label: 'Vétusté importante', points: 0 }] },
  { id: 'energyRenovation', category: 'État technique & travaux', name: 'Coût rénovation énergétique pour atteindre DPE C', max: 3, options: [{ label: '< 10 000 €', points: 3 }, { label: '10 000-25 000 €', points: 2 }, { label: '> 25 000 €', points: 0 }, { label: 'Déjà DPE A/B/C', points: 3 }] },
  { id: 'extension', category: 'État technique & travaux', name: 'Possibilité extension / aménagement', max: 2, options: [{ label: 'Possible selon PLU + techniquement faisable', points: 2 }, { label: 'Possible avec contraintes', points: 1 }, { label: 'Impossible', points: 0 }, { label: 'Non applicable', points: 0, na: true }] },
  { id: 'naturalRisks', category: 'Risques & contraintes', name: 'Risques naturels officiels', max: 3, options: [{ label: 'Zone non exposée', points: 3 }, { label: 'Zone faible', points: 2 }, { label: 'Zone forte', points: 0 }] },
  { id: 'hoaWorks', category: 'Risques & contraintes', name: 'Travaux copropriété votés', max: 3, options: [{ label: 'Aucun travail voté', points: 3 }, { label: 'Quote-part < 5 000 €', points: 1 }, { label: 'Quote-part > 5 000 €', points: 0 }, { label: 'Non applicable', points: 0, na: true }] },
  { id: 'pollutionNoise', category: 'Risques & contraintes', name: 'Pollution / bruit officiel', max: 2, options: [{ label: 'Zone faible', points: 2 }, { label: 'Zone moyenne', points: 1 }, { label: 'Zone élevée', points: 0 }] },
  { id: 'parking', category: 'Risques & contraintes', name: 'Stationnement', max: 2, options: [{ label: 'Place privative', points: 2 }, { label: 'Parking collectif ou stationnement facile', points: 1 }, { label: 'Rue uniquement / stationnement difficile', points: 0 }] },
];

const categories = Array.from(new Set(criteria.map((c) => c.category)));
const maxTheory = criteria.reduce((sum, c) => sum + c.max, 0);

function interpretation(score: number) {
  if (score >= 85) return 'Très bon choix objectif';
  if (score >= 70) return 'Bon choix';
  if (score >= 55) return 'Acceptable avec compromis';
  return 'Risque élevé ou mauvaise adéquation';
}

const defaultValues = Object.fromEntries(criteria.map((c) => [c.id, ''])) as Record<string, string>;
const defaultNotes = Object.fromEntries(criteria.map((c) => [c.id, ''])) as Record<string, string>;

export function App() {
  const [values, setValues] = useState(defaultValues);
  const [notes, setNotes] = useState(defaultNotes);

  const result = useMemo(() => {
    let obtained = 0;
    let applicableMax = 0;
    const zeroCriteria: string[] = [];
    const categoryScores = categories.map((category) => {
      let catObtained = 0;
      let catMax = 0;
      criteria.filter((c) => c.category === category).forEach((criterion) => {
        const option = values[criterion.id] === '' ? undefined : criterion.options[Number(values[criterion.id])];
        if (!option || option.na) return;
        applicableMax += criterion.max;
        obtained += option.points;
        catMax += criterion.max;
        catObtained += option.points;
        if (option.points === 0) zeroCriteria.push(criterion.name);
      });
      return { category, obtained: catObtained, max: catMax, percent: catMax ? Math.round((catObtained / catMax) * 100) : 0 };
    });
    const raw = applicableMax ? (obtained / applicableMax) * 100 : 0;
    const finalScore = Math.round(raw);
    return { obtained, applicableMax, finalScore, categoryScores, zeroCriteria };
  }, [values]);

  const reset = () => { setValues(defaultValues); setNotes(defaultNotes); };

  return (
    <main>
      <section className="hero">
        <div className="eyebrow">Évaluateur V1 • Frontend uniquement</div>
        <h1>Score objectif d’une résidence principale, lisible en moins de 10 minutes.</h1>
        <p>Un formulaire clair, un barème modifiable côté frontend et un résultat normalisé sur 100 avec prise en compte des critères non applicables.</p>
        <div className="hero-actions">
          <a className="button primary" href="#formulaire">Commencer l’évaluation</a>
          <button className="button secondary" type="button" onClick={() => window.print()}>Exporter PDF</button>
        </div>
      </section>

      <section className="trustbar" aria-label="Résumé V1">
        <div><strong>{criteria.length}</strong><span>critères objectifs</span></div>
        <div><strong>{maxTheory}</strong><span>points théoriques</span></div>
        <div><strong>0</strong><span>backend / compte / BDD</span></div>
        <div><strong>100%</strong><span>scoring frontend</span></div>
      </section>

      <section className="layout" id="formulaire">
        <aside className="score-card">
          <span className="label">Score final</span>
          <div className="score">{result.finalScore}<small>/100</small></div>
          <p className="interpretation">{interpretation(result.finalScore)}</p>
          <div className="meter"><span style={{ width: `${result.finalScore}%` }} /></div>
          <p className="small">Points retenus : {result.obtained} / {result.applicableMax || 0}. Les critères “Non applicable” sont exclus puis le score est normalisé.</p>
          <button className="button primary wide" type="button" onClick={reset}>Réinitialiser</button>
          <button className="button secondary wide" type="button" onClick={() => window.print()}>Exporter PDF simple</button>
        </aside>

        <div className="panel">
          {categories.map((category) => (
            <section className="category" key={category}>
              <div className="category-head">
                <h2>{category}</h2>
                {result.categoryScores.filter((c) => c.category === category).map((cat) => (
                  <span className="pill" key={cat.category}>{cat.obtained}/{cat.max} pts • {cat.percent}%</span>
                ))}
              </div>
              <div className="criteria-grid">
                {criteria.filter((c) => c.category === category).map((criterion) => {
                  const selected = values[criterion.id] === '' ? undefined : criterion.options[Number(values[criterion.id])];
                  return (
                    <article className="criterion" key={criterion.id}>
                      <div className="criterion-top">
                        <label htmlFor={criterion.id}>{criterion.name}</label>
                        <span className={selected?.na ? 'points muted' : 'points'}>{selected ? (selected.na ? 'Exclu' : `${selected.points}/${criterion.max} pts`) : `—/${criterion.max}`}</span>
                      </div>
                      <select id={criterion.id} value={values[criterion.id]} onChange={(event) => setValues((current) => ({ ...current, [criterion.id]: event.target.value }))}>
                        <option value="">Choisir une option</option>
                        {criterion.options.map((option, index) => <option value={index} key={option.label}>{option.label}</option>)}
                      </select>
                      <textarea value={notes[criterion.id]} onChange={(event) => setNotes((current) => ({ ...current, [criterion.id]: event.target.value }))} placeholder="Note personnelle facultative" rows={2} />
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="results">
        <div className="result-block">
          <h2>Détail par catégorie</h2>
          <div className="breakdown">
            {result.categoryScores.map((cat) => <div key={cat.category}><span>{cat.category}</span><strong>{cat.obtained}/{cat.max} pts — {cat.percent}%</strong></div>)}
          </div>
        </div>
        <div className="result-block">
          <h2>Critères à 0 point</h2>
          {result.zeroCriteria.length ? <ul>{result.zeroCriteria.map((name) => <li key={name}>{name}</li>)}</ul> : <p>Aucun critère applicable sélectionné à 0 point.</p>}
        </div>
      </section>

      <section className="marketing">
        <h2>Pourquoi cette V1 est volontairement simple</h2>
        <div className="feature-grid">
          <div><h3>Calcul fiable</h3><p>Les points maximum non applicables sont retirés du dénominateur avant normalisation sur 100.</p></div>
          <div><h3>Barème modifiable</h3><p>Tous les critères sont centralisés dans un tableau JavaScript unique.</p></div>
          <div><h3>Lecture immédiate</h3><p>Score global, interprétation, catégories et alertes à 0 point restent visibles.</p></div>
        </div>
      </section>

      <section className="faq">
        <h2>FAQ V1</h2>
        <details open><summary>Les données sont-elles sauvegardées ?</summary><p>Non. Aucun compte, backend, API ni base de données dans cette V1.</p></details>
        <details><summary>Le PDF est-il généré côté serveur ?</summary><p>Non. Le bouton utilise l’impression navigateur pour sauvegarder simplement en PDF.</p></details>
        <details><summary>Comment ajouter un critère ?</summary><p>Il suffit d’ajouter une entrée dans le tableau <code>criteria</code> avec catégorie, maximum et options.</p></details>
      </section>
    </main>
  );
}
