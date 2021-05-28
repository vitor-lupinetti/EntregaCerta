import {
    Connection,
    createConnection
} from "typeorm";

export default async (): Promise<Connection> => {
    return createConnection()
};
