import { CorsOptions, CustomOrigin } from '@nestjs/common/interfaces/external/cors-options.interface';

const whitelist = process.env.SERVER_ORIGIN_WHITELIST
  ? JSON.parse(process.env.SERVER_ORIGIN_WHITELIST)
  : process.env.SERVER_ORIGIN
    ? [process.env.SERVER_ORIGIN]
    : [];

export const corsOptions = (isProd: boolean) =>
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
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    origin: isProd
      ? (function(origin, callback) {
          if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        } as CustomOrigin)
      : false,
  } as CorsOptions);
