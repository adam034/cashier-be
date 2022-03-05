import { 
    HttpException,
    HttpStatus,
    Injectable,
    NestMiddleware,
    Next,
    Req,
    Res, 
} from "@nestjs/common";
import { AuthService } from "src/modules/auth/auth.service";
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly authService: AuthService
    ){}
    async use(@Req() req: any, @Res() res: any, @Next() next:any) {
        const authHeaders = req.headers.authorization;
        if (authHeaders && (authHeaders as string).split(' ')[1]) {
            const token = (authHeaders as string).split(' ')[1]
            req.user = await this.authService.verifyUser(token)
            next()
        } else {
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }
    }
}

