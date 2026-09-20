export default async function handler(req, res) {
  // CORS 헤더 먼저 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { endpoint, ...params } = req.query;
    const serviceKey = process.env.TOUR_API_KEY;

    const searchParams = new URLSearchParams();
    searchParams.set('serviceKey', serviceKey);
    searchParams.set('MobileOS', 'ETC');
    searchParams.set('MobileApp', 'Yeojung');
    searchParams.set('_type', 'json');
    
    Object.keys(params).forEach(k => {
      searchParams.set(k, params[k]);
    });

    const url = `https://apis.data.go.kr/B551011/KorService2/${endpoint}?${searchParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    const text = await response.text();
    
    res.status(200).setHeader('Content-Type', 'application/json; charset=utf-8').send(text);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
