export class HttpMessage {
    static ok(body?: any): HttpMessage {
        return new HttpMessage(200, body);
    }

    static badRequest(body?: any) {
        return new HttpMessage(400, body);
    }

    static notFound(): HttpMessage {
        return new HttpMessage(404);
    }

    static internalServerError() {
        return new HttpMessage(500);
    }

    static notImplemented() {
        return new HttpMessage(501);
    }

    constructor(
        public status: number,
        public body?: any
    ) { }
}
