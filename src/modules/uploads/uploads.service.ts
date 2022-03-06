import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class UploadsService {

    async getFileUrl(req:any, file_url:any){
        const [header] = process.env.SSL === "TRUE" ? req.headers.host.split(":") : [req.headers.host];
        const protocol = process.env.SSL === "TRUE" ? "https" : "http";
        let path = file_url.path.replace(/\\/g, "/").split('uploads');
        let url = `${protocol}://${header}/${path[1]}`;
        return url
    }
}
