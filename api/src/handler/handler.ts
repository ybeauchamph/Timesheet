import { Request, Response, Next } from 'restify';

export interface RequestHandler {
    process(req: Request, res: Response, next: Next);
}