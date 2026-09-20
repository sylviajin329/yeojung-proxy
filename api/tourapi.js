export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { endpoint, ...params } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: 'endpoint 파라미터 필요' });
  }

  const serviceKey = process.env.TOUR_API_KEY;
  if (!serviceKey) {
    return res.status(500).json({ error: 'API 키 미설정' });
  }

  const qs = new URLSearchParams({
    serviceKey,
    MobileOS: 'ETC',
    MobileApp: 'Yeojung',
    _type: 'json',
    ...params
  });

  const url = `https://apis.data.go.kr/B551011/KorService2/${endpoint}?${qs}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
