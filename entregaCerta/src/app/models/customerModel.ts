import { AddressModel } from './addressModel';
import { UserModel } from './userModel';


export interface CustomerModel {
    id: string;
    idAddress: string;
    complement:string;
    contactNumber:string;
    email:string;
    hasWhatsApp:string;
    homeNumber:string;
    name:string;
    photo:string;
    token:string;
    userEntity: UserModel;
    addressEntity:AddressModel;
}