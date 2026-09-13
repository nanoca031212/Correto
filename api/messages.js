// api/messages.js - Vercel Serverless Function para receber mensagens MCP

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }
  // Em producao com multiplos usuarios, o sessionId viria do header ou query param
  // e o transport correspondente viria de um store compartilhado (Redis, etc).
  // Para implementacao simples (1 conexao por vez), retornar 200 OK.
  res.status(200).json({ ok: true });
}
