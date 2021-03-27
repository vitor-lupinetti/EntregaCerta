import { AddressModel } from './addressModel';
import { UserEntity } from './userModel';

export interface CustomerModel {
    id: string;
    idAddress: string;
    userEntity: UserEntity;
    addressEntity:AddressModel;
}