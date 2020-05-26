import { createHmac, timingSafeEqual } from 'crypto';

// Эта функция используется для проверки GitHub подписи
export function checkGitHubSig(sig: string, body: object, secretKey: string) {
  const hmac = createHmac('sha1', secretKey);
  const digest = Buffer.from('sha1=' + hmac.update(JSON.stringify(body)).digest('hex'), 'utf8');
  const checksum = Buffer.from(sig, 'utf8');

  return checksum.length === digest.length && timingSafeEqual(digest, checksum);
}
