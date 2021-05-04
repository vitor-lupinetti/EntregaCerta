import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './Checkout.css';

//interface que molda qual parametro sera recebido.
interface CheckoutProps{
    product:{
        nome: string,
        preco: number
    }
} 

interface Product{
    nome: string,
    preco: number
}

//React.Fc para poder receber o parametro. 
//props -> todos os parametros que sao recebidos
function Checkout(props: CheckoutProps){
    const location = useLocation<CheckoutProps>();
    const history = useHistory();
    const [product, setProduct] = useState<Product>();

    function handleToLogin(){
        // history.push('/login');
        history.push({
            pathname: '/login',
            state: { product }
        });
    }

    useEffect(() => {
       setProduct(location.state.product)
    }, [location]);

    return (
        <div className="container-checkout">
            <h1>Checkout</h1>

            <p>Você está comprando um {location.state.product.nome}, no valor de {location.state.product.preco}</p>
            <p>Gostaria de utilizar os serviços do Entrega Certa?</p>

            <button onClick={handleToLogin}>Sim</button>
            <button>Prosseguir com compra</button>
        </div>
    );
}

export default Checkout;