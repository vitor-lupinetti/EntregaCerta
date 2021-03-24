import { FindOneOptions, getConnection, getRepository, Repository } from "typeorm";
import { AddressEntity } from "../entities/AddressEntity";

import { CustomerEntity } from "../entities/CustomerEntity";
import { NeighborhoodEntity } from "../entities/NeighborhoodEntity";
import { UserEntity } from "../entities/UserEntity";
import { UserTypeEntity } from "../entities/UserTypeEntity";
import { AddressService } from "./AddressService";
import { NeighborhoodService } from "./NeighborhoodService";
import { GenericService } from "./Service";
import UserService from "./UserService";
import UserTypeService from "./UserTypeService";
import { CustomerValidation } from "./validations/CustomerValidation";

interface CustomerRelationsDTO{
    complement: string, 
    contactNumber: string, 
    email: string, 
    hasWhatsApp:string, 
    homeNumber:string, 
    name: string, 
    photo: string,
    cep:string, 
    street:string,
    neighborhood:string,
    password:string,
    user:string,
}

interface CustomerRelationsUpdateDTO{
    complement: string, 
    contactNumber: string, 
    email: string, 
    hasWhatsApp:string, 
    homeNumber:string, 
    cep:string, 
    street:string,
    neighborhood:string,
    id:string
}

export class CustomerService extends GenericService<CustomerEntity>{
    constructor(repo: Repository<CustomerEntity>) {
        super(repo, new CustomerValidation());
    }


    public async createCustomerWithRelations(model: CustomerRelationsDTO){
        const userTypeRepository = getRepository(UserTypeEntity);
        const userTypeService = new UserTypeService(userTypeRepository);

        const neighborhoodRepository = getRepository(NeighborhoodEntity);
        const neighborhoodService = new NeighborhoodService(neighborhoodRepository);

        const addressRepository = getRepository(AddressEntity);
        const addressService = new AddressService(addressRepository);

        const userRepository = getRepository(UserEntity);
        const userService = new UserService(userRepository);

        const customerRepository = getRepository(CustomerEntity);
        const customerService = new CustomerService(customerRepository);

        const userType: UserTypeEntity = await userTypeService.findOne({ where: { description: "Buyer" } });
        const { complement, contactNumber, email, hasWhatsApp, homeNumber, name } = model;
        const photo = model.photo;

        // Campos AddressEntity
        const { cep, street } = model;
        // Campos NeighborhoodEntity
        const { neighborhood } = model;
        // Campos UserEntity
        const { password, user } = model;

        
        const customerToCreate: CustomerEntity = { complement, contactNumber, email, hasWhatsApp, homeNumber, name, photo };
        customerToCreate.addressEntity = { cep, street };
        customerToCreate.addressEntity.neighborhoodEntity = { name: neighborhood };
        customerToCreate.userEntity = { idUserType: userType.id || "", password, user };

        const neighborhoodCreated = await neighborhoodService.create(customerToCreate.addressEntity.neighborhoodEntity);

        if (neighborhoodCreated) {
            customerToCreate.addressEntity.idNeighborhood = neighborhoodCreated.id;
            customerToCreate.addressEntity.neighborhoodEntity = neighborhoodCreated;
        }

        const addressCreated = await addressService.create(customerToCreate.addressEntity);

        if (addressCreated) {
            customerToCreate.idAddress = addressCreated.id;
            customerToCreate.addressEntity = addressCreated;
        }


        const userCreated = await userService.create(customerToCreate.userEntity);

        customerToCreate.id = userCreated.id;
        customerToCreate.userEntity = userCreated;
        const customerCreated = await super.create(customerToCreate);
        return customerCreated;
    }

    public async list(options?: FindOneOptions<CustomerEntity>): Promise<CustomerEntity[]>{
        const customers = await super.list(options);

        customers.forEach(customer => {
            customer.photo_url =`http://localhost:3333/uploads/${customer.photo}`
        });

        return customers;
    }

    public async findOne(options?: FindOneOptions<CustomerEntity>): Promise<CustomerEntity> {
        const customer = await super.findOne(options);
        if(customer){
            customer.photo_url = `http://localhost:3333/uploads/${customer.photo}`;
        }

        return customer;
    }



    public async updateCustomer(model:CustomerRelationsUpdateDTO):Promise<CustomerEntity>{
        let customerFound = await this.findOne({where:{id : model.id}, relations: ["userEntity", "addressEntity","userEntity.userTypeEntity", "addressEntity.neighborhoodEntity"]}); 
        customerFound.addressEntity!.cep = model.cep;
        customerFound.addressEntity!.street = model.street;
        customerFound.addressEntity!.neighborhoodEntity!.name = model.neighborhood;
        customerFound.complement = model.complement;
        customerFound.contactNumber = model.contactNumber;
        customerFound.email = model.email;
        customerFound.hasWhatsApp = model.hasWhatsApp;
        customerFound.homeNumber = model.homeNumber;
        

        let customValidation = new CustomerValidation();
        await customValidation.validateOnUpdate(this,customerFound);

        const id = String(model.id);
        delete customerFound.photo_url;
        await this.repository.update(id,customerFound);
        await this.repository.save(customerFound);

        customerFound.photo_url =`http://localhost:3333/uploads/${customerFound.photo}`
        return customerFound;
    }
}
