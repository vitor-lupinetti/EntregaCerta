import { UserTypeModel } from './userTypeModel';

export interface UserModel extends UserTypeModel{
    id: string;
    idUserType:string;
    user:string;
    password:string;
    userTypeEntity:UserTypeModel;
}