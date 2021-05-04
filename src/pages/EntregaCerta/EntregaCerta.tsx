import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import api from '../../services/api';
import './EntregaCerta.css'

interface ReceiversResponse{
    id:string,
    contactNumber:string,
    homeNumber: string,
    name: string,
    addressEntity:{
        cep: string,
        street: string,
        neighborhoodEntity:{
            name: string
        }
    },
    photo:string
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

export function EntregaCerta(){

    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const history = useHistory();
    const { addToast } = useToasts();


    const [receivers, setReceivers] = useState<ReceiversResponse[]>([]);
    const [receiver, setReceiver] = useState<ReceiversResponse>();
    const location = useLocation<CheckoutProps>();
    const [product, setProduct] = useState<Product>();
    const [formData, setFormData] = useState({
        cep:'',
        neighborhood: '',
        name:'',
        complement: ''
    });

    function handleInputChange(event:ChangeEvent<HTMLInputElement>)
    {
        const { name, value } = event.target;

        setFormData({...formData, [name]: value});

    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        if(!receiver){
            addToast('Selecione um recebedor!',{ appearance: 'error', autoDismiss:true });
            return;
        }
        try{
            let postOject = {
                idBuyer:userId,
                idReceiver: receiver?.id,
                description:'Ecommerce - ' + location.state.product.nome + ' - ' + new Date()
            }

            const response = await api.post('delivery',postOject, { headers: {"Authorization" : `Bearer ${process.env.REACT_APP_ECOMMERCE_TOKEN}`} });
            history.push('/Finish')
        }
        catch(err){
            addToast('Erro ao completar o pedido, tente mais tarde.',{ appearance: 'error', autoDismiss:true });
        }
    }

    async function handleReceivers(event: FormEvent){
        event.preventDefault();
        try{
            const response = await api.post<ReceiversResponse[]>('receiving-points',formData, { headers: {"Authorization" : `Bearer ${token}`} });
            setReceivers(response.data);
            console.log(response.data)
        }
        catch(err){
            console.log(err)
        }
    }

    function handleSelectReceiver(event:ChangeEvent<HTMLSelectElement>){
        const receiverSelected = event.target.value;

        const receiverFound = receivers.find(r=> r.name == receiverSelected)

        setReceiver(receiverFound);
    }
   
   
    useEffect(() => {
        (async () => {
            try{
                const response = await api.post<ReceiversResponse[]>('receiving-points',{}, { headers: {"Authorization" : `Bearer ${token}`} });
                setReceivers(response.data);
            }
            catch(err){
                console.log(err)
            }
          
        })();
        
        console.log(receivers);
    }, []);

    useEffect(() => {
        setProduct(location.state.product)
    }, [location]);
 



    return(
        <Container>
            <Row>
            <h2>Integração com Entrega Certa</h2>
            
            <form  className="mt-5"  onSubmit={handleSubmit}>
                
                <Row>
                    
                    <Col md={6} sm={12}>
                        <Card>
                            <Card.Header>
                                <h3>Filtros</h3>
                            </Card.Header>
                            <Card.Body>
                                
                                <Row>
                                    <Col>
                                        <Form.Control name="cep" onChange={handleInputChange} className="input-text" type="text" placeholder="CEP"></Form.Control>
                                    </Col>
                                    <Col>
                                        <Form.Control name="neighborhood" onChange={handleInputChange} className="input-text" type="text" placeholder="Rua"></Form.Control>
                                    </Col>
                                    <Col>
                                        <Form.Control name="name" onChange={handleInputChange} className="input-text" type="text" placeholder="Nome Recebedor"></Form.Control>
                                    </Col>
                                </Row>
                                <br/>
                                <Row className="justify-content-md-center">
                                    <Button onClick={handleReceivers} >Filtrar</Button>
                                </Row>

                                
                            </Card.Body>
                        </Card>
                        <br/>
                        <Card>
                            <Card.Header>
                                <h3>Produto</h3>
                            </Card.Header>
                            <Card.Body >
                                <article key = {location.state.product.nome}>
                                    <strong>{location.state.product.nome}</strong>
                                    <p>R$ {location.state.product.preco}</p>
                                    
                                </article>
                            </Card.Body>
                        </Card>
                        
                    </Col>
                    <Col md={6} sm={12}>
                        <Card>
                            <Card.Header>
                                <h3>Dados do recebedor</h3>
                            </Card.Header>
                            <Card.Body>
                                
                                <label>Escolha um recebedor na lista abaixo</label>
                                <Form.Control as="select" onChange={handleSelectReceiver} className="">
                                    <option value="0">Selecione</option>
                                    {receivers.map(receiver =>(
                                            <option key={receiver.name} value={receiver.name} >{receiver.name}</option>
                                    ))}
                                </Form.Control>
                                <br/>
                                <Row >
                                    <Col >
                                        <Form.Label>CEP</Form.Label>
                                        <Form.Control name="cep" onChange={handleInputChange} className="input-text" type="text" value={receiver?.addressEntity.cep}></Form.Control>
                                    </Col>
                                    <Col>
                                        <Form.Label>Bairro</Form.Label>
                                        <Form.Control name="neighborhood" onChange={handleInputChange} className="input-text" type="text" value={receiver?.addressEntity.neighborhoodEntity.name}></Form.Control>
                                    </Col>
                                    <Col>
                                        <Form.Label>Rua</Form.Label>
                                        <Form.Control name="name" onChange={handleInputChange} className="input-text" type="text" value={receiver?.addressEntity.street}></Form.Control>
                                    </Col>
                                </Row>
                                {
                                 receiver?.photo?(
                                    <Row className="column-container mt-5 img-container">
                                    <label>Foto Recebedor</label>
                                    <img src={`data:image/jpeg;base64,${receiver?.photo}`} />
                                    </Row>
                                 ):(<div></div>)
                                    
                                }
                               

                            </Card.Body>
                        </Card>
                        
                    </Col>
                </Row>
                
                
                <Row className="justify-content-md-center mt-5">
                    <Button type="submit">Finalizar compra</Button>
                </Row>
            </form>
            </Row>

        </Container>
    )

}