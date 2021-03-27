import { UserTypeModel } from './userTypeModel';
export interface UserEntity{
    id: string;
    idUserType:string;
    user:string;
    userTypeEntity:UserTypeModel;
}