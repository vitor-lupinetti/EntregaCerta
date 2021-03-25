export class AppError {
    public readonly message: string | Array<string>;
    public readonly statusCode: number;

    constructor(message: string | Array<string>, statusCode = 400) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
