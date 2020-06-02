import { CorsOptions, CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsOptions = (isProd: boolean, whitelist: string[] = []) =>
  ({
    /**
     * Заголовки, которые приходят в ответе на preflight request и которые могут быть использованы в
     * фактическом запросе к серверу
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers
     */
    allowedHeaders: 'Authorization,Accept,Content-Type',
    /**
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
     */
    credentials: true,
    /**
     * Дополнительный заголовки (кроме стандартных, которые будут доступны клиенту для чтения)
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
     */
    exposedHeaders: 'Authorization',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    origin: isProd
      ? (function(origin, callback) {
          if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        } as CustomOrigin)
      : true,
  } as CorsOptions);
