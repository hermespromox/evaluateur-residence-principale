import { type FormEvent, useMemo, useState } from 'react';

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

const defaultValues = Object.fromEntries(criteria.map((c) => [c.id, ''])) as Record<string, string>;
const defaultNotes = Object.fromEntries(criteria.map((c) => [c.id, ''])) as Record<string, string>;

type ContactState = { name: string; email: string; phone: string; project: string; budget: string };
const defaultContact: ContactState = { name: '', email: '', phone: '', project: '', budget: '' };

function interpretation(score: number) {
  if (score >= 85) return 'Très bon choix objectif';
  if (score >= 70) return 'Bon choix';
  if (score >= 55) return 'Acceptable avec compromis';
  return 'Risque élevé ou mauvaise adéquation';
}

const testimonials = [
  { quote: 'On hésitait sur une maison coup de cœur. Scory a mis noir sur blanc les compromis : trajet, charges et travaux. On a évité une décision émotionnelle.', name: 'Claire & Mehdi', role: 'Acheteurs à Lyon' },
  { quote: 'Le score par catégorie rend la discussion beaucoup plus simple avec mon courtier et ma famille. Tout le monde voit où le bien est solide ou fragile.', name: 'Nadia B.', role: 'Primo-accédante' },
  { quote: 'En agence, je l’utilise comme pré-diagnostic avant visite. Les clients arrivent avec des critères clairs et moins de regrets après coup.', name: 'Thomas R.', role: 'Conseiller immobilier' },
];

const features = [
  { title: 'Score objectif sur 100', text: 'Vie quotidienne, budget, confort, travaux et risques : chaque réponse pèse dans une note claire.' },
  { title: 'Moins de regrets après signature', text: 'Mieux vaut perdre 5 minutes dans un formulaire que vivre avec 20 regrets pendant des années.' },
  { title: 'Conseil humain en option', text: 'Besoin d’un avis ? Envoyez votre situation et recevez une lecture personnalisée.' },
];

export function App() {
  const [values, setValues] = useState(defaultValues);
  const [notes, setNotes] = useState(defaultNotes);
  const [contact, setContact] = useState(defaultContact);
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const result = useMemo(() => {
    let obtained = 0;
    let applicableMax = 0;
    const zeroCriteria: string[] = [];
    const categoryScores = categories.map((category) => {
      let catObtained = 0;
      let catMax = 0;
      criteria.filter((c) => c.category === category).forEach((criterion) => {
        const option = values[criterion.id] === '' ? undefined : criterion.options[Number(values[criterion.id])];
        if (option?.na) return;
        const points = option?.points ?? 0;
        applicableMax += criterion.max;
        obtained += points;
        catMax += criterion.max;
        catObtained += points;
        if (option && points === 0) zeroCriteria.push(criterion.name);
      });
      return { category, obtained: catObtained, max: catMax, percent: catMax ? Math.round((catObtained / catMax) * 100) : 0 };
    });
    const raw = applicableMax ? (obtained / applicableMax) * 100 : 0;
    const finalScore = Math.round(raw);
    return { obtained, applicableMax, finalScore, categoryScores, zeroCriteria };
  }, [values]);

  const reset = () => { setValues(defaultValues); setNotes(defaultNotes); };

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...contact, score: result.finalScore, categoryScores: result.categoryScores, zeroCriteria: result.zeroCriteria }),
      });
      if (!response.ok) throw new Error('send failed');
      setContactStatus('sent');
      setContact(defaultContact);
    } catch {
      setContactStatus('error');
    }
  };

  return (
    <main>
      <nav className="topbar" aria-label="Navigation principale">
        <a className="brand" href="#top" aria-label="Scory accueil">
          <span className="material-symbols-outlined" aria-hidden="true">family_home</span>
          <strong>Scory</strong>
        </a>
        <div className="navlinks">
          <a href="#solution">Solution</a>
          <a href="#formulaire">Évaluation</a>
          <a href="#temoignages">Témoignages</a>
          <a href="#contact">Conseils</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="eyebrow">Scory • SaaS d’aide à la décision immobilière</div>
        <h1>Avant d’acheter, voyez le score réel de votre futur chez-vous.</h1>
        <p className="hero-copy">Perdez 5 minutes dans Scory plutôt que 20 regrets après la signature. Transformez une visite coup de cœur en décision rationnelle : budget, trajet, confort, travaux et risques sont notés sur 100.</p>
        <div className="hero-actions">
          <a className="button primary" href="#formulaire">Calculer mon score</a>
          <a className="button secondary" href="#contact">Demander un avis</a>
        </div>
        <div className="hero-proof">
          <span>Sans compte</span><span>Score instantané</span><span>Conseil optionnel</span><span>Export PDF</span>
        </div>
      </section>

      <section className="trustbar" aria-label="Preuves produit">
        <div><strong>{criteria.length}</strong><span>critères immobiliers</span></div>
        <div><strong>{maxTheory}</strong><span>points de contrôle</span></div>
        <div><strong>5 min</strong><span>pour éviter les regrets</span></div>
        <div><strong>0</strong><span>compte obligatoire</span></div>
      </section>

      <section className="marketing" id="solution">
        <div className="section-kicker">La valeur Scory</div>
        <h2>Un vrai produit SaaS pour objectiver l’achat le plus important de votre vie.</h2>
        <div className="feature-grid">
          {features.map((feature) => <div key={feature.title}><h3>{feature.title}</h3><p>{feature.text}</p></div>)}
        </div>
      </section>

      <section className="how-it-works">
        <div><span>1</span><h3>Répondez aux critères</h3><p>Listes déroulantes simples, notes personnelles et critères non applicables.</p></div>
        <div><span>2</span><h3>Lisez le score</h3><p>Score final, catégories, alertes à 0 point et interprétation immédiate.</p></div>
        <div><span>3</span><h3>Demandez conseil</h3><p>Envoyez votre résultat pour recevoir une aide personnalisée avant de vous engager.</p></div>
      </section>

      <section className="layout" id="formulaire">
        <aside className="score-card">
          <span className="label">Score Scory</span>
          <div className="score">{result.finalScore}<small>/100</small></div>
          <p className="interpretation">{interpretation(result.finalScore)}</p>
          <div className="meter"><span style={{ width: `${result.finalScore}%` }} /></div>
          <p className="small">Points retenus : {result.obtained} / {result.applicableMax || 0}. Seul “Non applicable” retire les points maximum du calcul.</p>
          <button className="button primary wide" type="button" onClick={reset}>Réinitialiser</button>
          <button className="button secondary wide" type="button" onClick={() => window.print()}>Exporter PDF</button>
        </aside>

        <div className="panel">
          <div className="panel-intro">
            <div className="section-kicker">Démo produit live</div>
            <h2>Évaluez votre bien maintenant</h2>
            <p>Tout est calculé côté interface. Les champs laissés vides comptent comme 0 jusqu’à sélection ; les critères explicitement non applicables sont exclus.</p>
          </div>
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
        <div className="result-block alert-block">
          <h2>À regarder avant offre</h2>
          {result.zeroCriteria.length ? <ul>{result.zeroCriteria.map((name) => <li key={name}>{name}</li>)}</ul> : <p>Aucun critère applicable sélectionné à 0 point.</p>}
        </div>
      </section>

      <section className="pricing">
        <div className="section-kicker">Offre</div>
        <h2>Commencez gratuitement, demandez un regard expert si l’enjeu devient sérieux.</h2>
        <div className="pricing-grid">
          <article><h3>Scory Free</h3><strong>0 €</strong><p>Score instantané, détail par catégorie, notes personnelles, export PDF.</p><a className="button secondary" href="#formulaire">Utiliser maintenant</a></article>
          <article className="highlight"><h3>Scory Conseil</h3><strong>Sur demande</strong><p>Lecture de votre score, points faibles, questions à poser avant offre et arbitrage des compromis.</p><a className="button primary" href="#contact">Demander conseil</a></article>
        </div>
      </section>

      <section className="testimonials" id="temoignages">
        <div className="section-kicker">Témoignages</div>
        <h2>Ils ont préféré vérifier avant de regretter.</h2>
        <div className="testimonial-grid">
          {testimonials.map((item) => <figure key={item.name}><blockquote>“{item.quote}”</blockquote><figcaption><strong>{item.name}</strong><span>{item.role}</span></figcaption></figure>)}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div>
          <div className="section-kicker">Conseils personnalisés</div>
          <h2>Vous avez un bien en tête ? Envoyez le contexte, Scory vous aide à décider.</h2>
          <p>Le message part via Resend vers l’équipe. Ajoutez votre score, votre doute principal, votre délai d’achat et les points qui vous inquiètent.</p>
        </div>
        <form className="contact-form" onSubmit={submitContact}>
          <input required name="name" placeholder="Votre nom" value={contact.name} onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))} />
          <input required type="email" name="email" placeholder="Email" value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} />
          <input name="phone" placeholder="Téléphone optionnel" value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} />
          <select value={contact.budget} onChange={(e) => setContact((c) => ({ ...c, budget: e.target.value }))}>
            <option value="">Budget / stade du projet</option>
            <option>Visite prévue</option><option>Offre à faire</option><option>Compromis en discussion</option><option>Besoin d’un second avis</option>
          </select>
          <textarea required rows={5} placeholder="Décrivez le bien, vos doutes et le type de conseil souhaité" value={contact.project} onChange={(e) => setContact((c) => ({ ...c, project: e.target.value }))} />
          <button className="button primary wide" disabled={contactStatus === 'sending'}>{contactStatus === 'sending' ? 'Envoi…' : 'Envoyer ma demande'}</button>
          {contactStatus === 'sent' && <p className="form-success">Demande envoyée. Nous revenons vers vous rapidement.</p>}
          {contactStatus === 'error' && <p className="form-error">Envoi impossible pour le moment. Réessayez ou écrivez à hermes.promox@gmail.com.</p>}
        </form>
      </section>

      <section className="faq">
        <h2>FAQ</h2>
        <details open><summary>Scory remplace-t-il un expert immobilier ?</summary><p>Non. Scory structure la décision et rend les compromis visibles. Pour un avis approfondi, utilisez le formulaire conseil.</p></details>
        <details><summary>Mes réponses sont-elles sauvegardées ?</summary><p>Non pour le score : le calcul reste dans votre navigateur. Le formulaire contact envoie uniquement les informations que vous choisissez de transmettre.</p></details>
        <details><summary>Pourquoi les critères vides comptent-ils comme 0 ?</summary><p>Parce qu’un point non vérifié reste un risque. Sélectionnez “Non applicable” uniquement quand le critère ne concerne vraiment pas le bien.</p></details>
        <details><summary>Puis-je exporter le résultat ?</summary><p>Oui, le bouton PDF utilise l’impression du navigateur.</p></details>
      </section>

      <section className="cta-banner">
        <span className="material-symbols-outlined" aria-hidden="true">family_home</span>
        <h2>Ne laissez pas un coup de cœur décider seul.</h2>
        <p>5 minutes de scoring maintenant peuvent éviter des années de compromis subis.</p>
        <a className="button primary" href="#formulaire">Lancer Scory</a>
      </section>

      <footer>
        <a className="brand" href="#top"><span className="material-symbols-outlined" aria-hidden="true">family_home</span><strong>Scory</strong></a>
        <span>Score immobilier objectif pour résidence principale.</span>
        <span>© 2026 Scory</span>
      </footer>
    </main>
  );
}
