import React, { useEffect, useState } from 'react';
import './Done.css';

//interface que molda qual parametro sera recebido.

function Done(){
   

    return (
        <div className="container-checkout">
            <h1>Pedido Concluido</h1>

            <p>Pronto! Seu pedido foi concluido e sera entregue em breve.</p>
            <p>Acesse o <a href="https://entregacerta-web.herokuapp.com/">site</a> do entrega certa para monitorar sua entrega com seu recebedor.</p>

        </div>
    );
}

export default Done;