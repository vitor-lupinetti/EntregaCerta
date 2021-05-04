import react, { useEffect, useState } from 'react';
import './Home.css';
import { useHistory } from 'react-router-dom';

interface Product{
    nome: string,
    preco: number
}
export default function Home(){

    const [products, setProducts] = useState<Product[]>([]);
    const history = useHistory();

    useEffect(() => {
        let productsArray:Product[] = [];
        productsArray.push({nome: 'Mouse',preco: 50},
            {nome: 'Teclado',preco: 100},
            {nome: 'Monitor',preco: 1000},
            {nome: 'Celular',preco: 2000},
            {nome: 'Playstation 5',preco: 4500},
            {nome: 'Xbox Series S',preco: 2300},

        )
        setProducts(productsArray);
    }, []);

    function handleNavigateCheckout(nome: string, preco: number){
        // history.push('/checkout', {nome, preco});

        history.push({
            pathname: '/checkout',
            state: { product: {nome, preco} }
        });
    }

    return(

        <div className = "product-list">{
            products.map(product => (
                <article key = {product.nome}>
                    <strong>{product.nome}</strong>
                    <p>R$ {product.preco}</p>
                    
                    <a onClick={()=> {handleNavigateCheckout(product.nome, product.preco)}}>Comprar</a>
                </article>
            ))}
            <div className = "actions"> 
                    <button disabled>Anterior</button>
                    <button>Próxima</button>
            </div>
        </div>


        // <div className="container">
        //     <div className="navbar">
        //         <p>ECommerce</p>
        //     </div>

        //     <div className= "main">
        //         <h2>Nossos produtos</h2>
        //         <div className="productsContainer">
        //                 {products.map(product => (
        //                     <div className="product"> 
        //                         <img src='images/mouse.png'></img>
        //                         <p>{product.nome}</p>
        //                         <br />
        //                         <p>R$ {product.preco}</p>
        //                         <button onClick={()=> {handleNavigateCheckout(product.nome, product.preco)}}>Comprar</button>
        //                     </div>
        //                 ))}
        //         </div>
        //     </div>
        // </div>
       
    )
}