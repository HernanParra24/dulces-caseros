import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Si hay un error de autenticación, no lanzamos el error
    // Solo retornamos undefined para indicar que no hay usuario autenticado
    if (err || !user) {
      return undefined;
    }
    return user;
  }
}
