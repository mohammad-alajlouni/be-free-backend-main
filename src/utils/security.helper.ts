import { Injectable } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import * as xss from 'xss';

@Injectable()
export class SecurityHelper {
  public static configureMongoSanitizer(): object {
    const isDevelopment = process.env.NODE_ENV === 'development';
    return {
      replaceWith: '_ModifiedByMongoSanitize',
      allowDots: false,
      dryRun: isDevelopment ? true : false,
      onSanitize: (params: any) => {
        const { req } = params;

        console.log(
          `Sanitized:Incoming request modified in the request from IP: ${req.ip}`,
        );
      },
    };
  }

  // ✅ التعديل هنا: ترجع كائن واحد بدلاً من مصفوفة
  public static configureRateLimiter(): { ttl: number; limit: number } {
    return { ttl: 61440, limit: 50 };
  }

  public static configureJWTOptions(): object {
    return {
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15 days' },
    };
  }

  public static configureThrottlerGuard() {
    return { provide: APP_GUARD, useClass: ThrottlerGuard };
  }

  public static configureCorsPolicy(): CorsOptions {
    return {
      origin: '*',
      credentials: true,
      methods: 'GET,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 200,
    };
  }

  public static sanitizeRequest(req: any) {
    if (req.body) {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          req.body[key] = xss.filterXSS(req.body[key]);
        }
      }
    }

    if (req.query) {
      for (const key in req.query) {
        if (typeof req.query[key] === 'string') {
          req.query[key] = xss.filterXSS(req.query[key]);
        }
      }
    }

    if (req.headers) {
      for (const key in req.headers) {
        if (typeof req.headers[key] === 'string') {
          req.headers[key] = xss.filterXSS(req.headers[key]);
        }
      }
    }

    if (req.params) {
      for (const key in req.params) {
        if (typeof req.params[key] === 'string') {
          req.params[key] = xss.filterXSS(req.params[key]);
        }
      }
    }
  }
}