import crypto from "crypto";
import { Request } from "express";
import multer from "multer";
import path from "path";
import { AppError } from "../errors/AppError";

export default {
    dest: path.resolve(__dirname, "..", "..", "uploads"),
    fileFilter: (request: Request, file: any, callback: any) => {
        const allowedMimes = [
            "image/gif",
            "image/jpeg",
            "image/jpg",
            "image/png"
        ];

        if (allowedMimes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new AppError("Tipo de arquivo inválido"));
        }
    },
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, "..", "..", "uploads"),
        filename(request, file, callback) {
            const fileName = crypto.randomBytes(16).toString("hex");

            callback(null, fileName);
        }
    })
};
