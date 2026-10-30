const MOCK_API_URL = 'http://127.0.0.1:3001/solicitudes';

export async function saveDemoRequest(request) {
  const response = await fetch(MOCK_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...request, createdAt: new Date().toISOString() }),
  });

  if (!response.ok) {
    throw new Error('La base local no confirmó el registro. Intenta de nuevo.');
  }

  return response.json();
}
