import express from 'express';

const app = express();
const port = process.env.PORT || 3333;

app.get('/', (request, response)=> {
    return response.json({message : "Entrega certa!"});
})

app.get('/teste', (request, response)=> {
    return response.json({message : "Entrega testada!"});
})

app.listen(port, ()=> {
    console.log('Server is running!!!');
});