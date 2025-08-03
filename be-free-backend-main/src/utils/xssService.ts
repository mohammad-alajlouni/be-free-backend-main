// xss-sanitizer.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as xss from 'xss';

@Injectable()
export class XssSanitizerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Sanitize request body
    if (req.body) {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          req.body[key] = xss.filterXSS(req.body[key]);
        }
      }
    }

    // Sanitize query parameters
    if (req.query) {
      for (const key in req.query) {
        if (typeof req.query[key] === 'string') {
          req.query[key] = xss.filterXSS(req.query[key]);
        }
      }
    }

    // Sanitize headers
    if (req.headers) {
      for (const key in req.headers) {
        if (typeof req.headers[key] === 'string') {
          req.headers[key] = xss.filterXSS(req.headers[key]);
        }
      }
    }

    // Sanitize params
    if (req.params) {
      for (const key in req.params) {
        if (typeof req.params[key] === 'string') {
          req.params[key] = xss.filterXSS(req.params[key]);
        }
      }
    }

    next();
  }
}
