import fs from "fs";
import path from "path";

interface ConvertedFile {
    fileEncoded: string;
    mimeType: string;
}

export class FileService {
    public convertToBase64(file: Express.Multer.File): ConvertedFile {
        let fileData = fs.readFileSync(file.path);
        let fileEncoded = fileData.toString('base64');
        let mimeType = file.mimetype;

        fs.unlink(
            path.resolve(__dirname, "..", "..", "uploads", file.filename),
            () => { /* Faz nada quando der erro */ }
        );

        return {
            fileEncoded,
            mimeType
        };
    }
}
