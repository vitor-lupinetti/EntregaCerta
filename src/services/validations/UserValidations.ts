import * as yup from 'yup'
import { UserEntity } from '../../entities/UserEntity'
import UserService from '../UserService';


async function validateUser(service:UserService, user: UserEntity): Promise<void>{
    await validateUserFields(user);
    await verifyUserExists(service, user.user);    
}

async function validateUserFields(user: UserEntity): Promise<void>{
    const schema = yup.object().shape({
        user: yup.string().required("Usuário inválido"),
        idUserType: yup.string().required("Tipo do usuário inválido"),
        password: yup.string().min(5).required("Senha inválida."),
    })
    
    await schema.validate(user,{abortEarly: true})
    
}

async function verifyUserExists(service:UserService, username: string): Promise<void>{
    const userFind = await service.findOne({where : {user: username}});

    if(userFind){
        throw new Error("Esse usuário já está sendo utilizado!");
    }
}

export {validateUser};