// Run with --env-file=nextjs/.env.student-test.local; never prints credentials.
await import('./airtable-smoke.mjs');
try {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('Missing OPENROUTER_API_KEY');
  const response = await fetch('https://openrouter.ai/api/v1/key', {
    headers: { Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`OpenRouter HTTP ${response.status}`);
  const body = await response.json();
  if (!body.data || typeof body.data !== 'object') throw new Error('Unexpected OpenRouter response');
  console.log(JSON.stringify({
    service: 'openrouter',
    authenticated: true,
    creditLimit: body.data.limit,
    remainingCredits: body.data.limit_remaining,
    inferenceTested: false,
  }));
} catch (error) {
  console.error(JSON.stringify({
    service: 'openrouter',
    ok: false,
    error: error.message,
    networkCode: error.cause?.code ?? null,
  }));
  process.exitCode = 1;
}
