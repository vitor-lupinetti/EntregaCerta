import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import './Login.css';
import api from '../../services/api';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

interface UserResponse{
    token: string,
    customer: {
        id:string
    }
}

interface Product{
    nome: string,
    preco: number
}

interface CheckoutProps{
    product:{
        nome: string,
        preco: number
    }
} 

export function Login(){

    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [product, setProduct] = useState<Product>();
    const location = useLocation<CheckoutProps>();
    const history = useHistory();


    useEffect(() => {
        setProduct(location.state.product)
    }, [location]);

    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        let login = {
            user,
            password:pass
        }

        try{
            let response = await api.post<UserResponse>('login', login);
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('userId', response.data.customer.id)
            console.log(response.data)
            history.push({
                pathname: '/EntregaCerta',
                state: { product }
            });
        }
        catch(err){
            console.log(err);
        }
    }

    function handleInputUser(event:ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;
        setUser(value);
    }

    function handleInputPass(event:ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;
        setPass(value);
    }
    
    return(
        
        <div className="login-container">
            <form onSubmit={handleSubmit} className="form">
                <h2>Faça seu login no sistema Entrega Certa</h2>
                <input onChange={handleInputUser} type="text" className="input" placeholder="Usuário"></input>
                <input onChange={handleInputPass} type="password" className="input" placeholder= "Senha"></input>
                <input className="btn" type="submit"></input>
            </form>
        </div>

    )
}