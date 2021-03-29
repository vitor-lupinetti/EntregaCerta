import { UserTypeModel } from './userTypeModel';

export interface UserModel{
    id: string;
    idUserType:string;
    user:string;
    password:string;
    userTypeEntity:UserTypeModel;
}