import { Injectable, NestMiddleware } from '@nestjs/common';
import * as expressMongoSanitize from 'express-mongo-sanitize';
import { SecurityHelper } from 'src/utils/security.helper';

@Injectable()
export class MongoSanitizeMiddleware implements NestMiddleware {
  private sanitizer = expressMongoSanitize(
    SecurityHelper.configureMongoSanitizer(),
  );

  use(req: any, res: any, next: () => void) {
    this.sanitizer(req, res, next);
  }
}
