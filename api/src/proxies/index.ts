/**
 * Proxies: optional forwarders to external services.
 * Mount in index.ts if needed, e.g.:
 *   app.use('/api/v1/external', proxyRouter);
 */

import type { Request, Response } from 'express';

export async function proxyHealth(_req: Request, res: Response) {
  res.json({ proxy: true, message: 'Proxy layer ready; add external endpoints here.' });
}
