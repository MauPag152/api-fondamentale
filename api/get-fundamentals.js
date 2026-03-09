export default async function handler(req, res) {
  // Récupération de la clé API stockée en toute sécurité dans Vercel
  const FMP_KEY = process.env.FMP_API_KEY;
  
  // On récupère le ticker envoyé par le tableau (ex: AAPL)
  const ticker = (req.query.ticker || "AAPL").toUpperCase();
  
  // Nettoyage pour l'API (on enlève les extensions comme .TO si présentes)
  const symbol = ticker.split(".")[0];

  const ratiosUrl = `https://financialmodelingprep.com/api/v3/ratios-ttm/${symbol}?apikey=${FMP_KEY}`;
  const profileUrl = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_KEY}`;

  try {
    const [ratiosRes, profileRes] = await Promise.all([
      fetch(ratiosUrl),
      fetch(profileUrl)
    ]);
    
    const ratios = (await ratiosRes.json())[0] || {};
    const profile = (await profileRes.json())[0] || {};

    // Autoriser le tableau HTML à lire ces données
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ ratios, profile });
  } catch (e) {
    res.status(500).json({ error: "Erreur de connexion à l'API" });
  }
}
