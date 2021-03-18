import express, { request, response } from 'express';
import "reflect-metadata";
import { getCustomRepository, getRepository } from 'typeorm';
require('dotenv/config');

import "./database";
import { UserEntity } from './entities/UserEntity';
import { UserRepository } from './repositories/UserRepository';
import { UserTypeRepository } from './repositories/UserTypeRepository';

const app = express();
app.use(express.json());
const port = process.env.PORT || 3333;

app.get('/', (request, response) => {
    return response.json({ message: "Entrega certa!" });
});

app.get('/teste', (request, response) => {
    return response.json({ message: "Entrega testada!" });
});

app.post('/add', async (request, response)=>{
    const {user ,password, idUserType} = request.body;

    const userRepository = getRepository(UserEntity);

    try{
        const userCreated = userRepository.create({
            idUserType,
            password,
            user
        });
    
        await userRepository.save(userCreated);
    
        return response.status(201).json(userCreated);
    }
    catch(err){
        return response.status(400).json({error: err.message});
    }
    
})

app.get('/users', async (request, response) => {

    let repository = getCustomRepository(UserRepository);
    let users = await repository.find({relations: ["userTypeEntity"]});

    return response.status(200).json(users);

})

app.get('/ler', async (request, response) => {


    let repository = getCustomRepository(UserTypeRepository);
    let userTypes = await repository.find();

    return response.status(200).json(userTypes);
});

app.listen(port, () => {
    console.log('Server is running!!!');
});
