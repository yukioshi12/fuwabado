// Vercelのエッジ関数: 日程一覧をGASから取ってきて、CDN側で20秒キャッシュする
// (GASの起動自体をスキップできるので、GAS側の20秒キャッシュより効果が大きい)
export const config = { runtime: 'edge' };

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwrpszH3-qr9MZzT7WAArJCMmHEMYGahRA2hFQo_JFsGKxeaYclP0ZWzeSoa5UC9MWi/exec';

export default async function handler() {
  try {
    const res = await fetch(GAS_URL + '?action=events');
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=20, stale-while-revalidate=60'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: '日程の取得に失敗しました' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
