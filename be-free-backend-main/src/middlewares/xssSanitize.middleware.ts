import { Injectable, NestMiddleware } from '@nestjs/common';
import { SecurityHelper } from 'src/utils/security.helper';

@Injectable()
export class XssSanitizeMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    SecurityHelper.sanitizeRequest(req);
    next();
  }
}
