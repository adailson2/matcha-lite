import http from 'http';

async function start() {
  // Lazy import to mirror Lambda runtime behavior
  const { handler } = await import('../src/health');

  const server = http.createServer(async (_req, res) => {
    try {
      const result = await handler();
      res.writeHead(result.statusCode, result.headers as any);
      res.end(result.body);
    } catch (err: any) {
      res.statusCode = 500;
      res.end(String(err?.message ?? err));
    }
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`http://localhost:${port}/health`);
  });
}

start().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
