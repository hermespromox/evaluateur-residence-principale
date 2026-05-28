import { Resend } from 'resend';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, budget, project, score, categoryScores = [], zeroCriteria = [] } = req.body || {};

  if (!name || !email || !project) {
    return res.status(400).json({ error: 'Nom, email et message sont requis.' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not configured.' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeBudget = escapeHtml(budget);
  const safeProject = escapeHtml(project).replace(/\n/g, '<br/>');
  const safeScore = escapeHtml(String(score ?? 'Non fourni'));
  const safeCategories = Array.isArray(categoryScores)
    ? categoryScores.map((cat: any) => `<li>${escapeHtml(cat.category)} : <strong>${escapeHtml(String(cat.obtained))}/${escapeHtml(String(cat.max))} pts — ${escapeHtml(String(cat.percent))}%</strong></li>`).join('')
    : '';
  const safeZeros = Array.isArray(zeroCriteria) && zeroCriteria.length
    ? zeroCriteria.map((item: string) => `<li>${escapeHtml(item)}</li>`).join('')
    : '<li>Aucun critère à 0 point transmis</li>';

  try {
    await resend.emails.send({
      from: 'Scory <onboarding@resend.dev>',
      to: [process.env.CONTACT_TO_EMAIL || 'hermes.promox@gmail.com'],
      replyTo: email,
      subject: `Nouvelle demande Scory — ${name} — score ${safeScore}/100`,
      html: `
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; line-height: 1.6; max-width: 720px; color: #140400;">
          <h1 style="margin: 0 0 8px;">Nouvelle demande conseil Scory</h1>
          <p style="color:#521000;">Un utilisateur demande de l’aide avant achat immobilier.</p>
          <div style="background:#FEF7ED; border:1px solid #EBD5C1; border-radius:16px; padding:20px; margin:20px 0;">
            <p><strong>Nom :</strong> ${safeName}</p>
            <p><strong>Email :</strong> ${safeEmail}</p>
            ${safePhone ? `<p><strong>Téléphone :</strong> ${safePhone}</p>` : ''}
            ${safeBudget ? `<p><strong>Stade :</strong> ${safeBudget}</p>` : ''}
            <p><strong>Score Scory :</strong> ${safeScore}/100</p>
          </div>
          <h2>Message</h2>
          <div style="background:#FFFDFB; border:1px solid #EBD5C1; border-radius:12px; padding:18px;">${safeProject}</div>
          <h2>Détail par catégorie</h2>
          <ul>${safeCategories}</ul>
          <h2>Points à surveiller</h2>
          <ul>${safeZeros}</ul>
          <p style="margin-top:32px; color:#7a3a23; font-size:13px;">Reçu via Scory.</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
