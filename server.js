const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

const accessKey = [chave-de-acesso-aqui] // Chave de acesso para a utilização da IP API

app.use(cors());

// Consulta o CEP
async function getCep(cep) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    const response = await axios.get(url);
    return response.data;
}

// API CEP
app.get('/cep', async (req, res) => {
    const { cep } = req.query;

    if (!cep) {
        return res.status(400).json({ error: 'Informe um CEP' });
    }

    try {
        const data = await getCep(cep);

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar o CEP' });
    }
})

// Consulta Pokemon API
async function getPokemon(name) {
    name = name.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;

    const response = await axios.get(url);
    return response.data;
}

app.get('/pokemon', async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: 'Informe um nome de Pokémon' });
    }

    try {
        const data = await getPokemon(name);
        res.json({
            name: data.name,
            id: data.id,
            height: data.height,
            weight: data.weight,
            types: data.types.map(t => t.type.name)
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao consultar o Pokémon' });
    }
})

// API de Geolocalização por IP
async function getGeoIP(ip) {
    const url = `http://api.ipapi.com/api/${ip}?access_key=${accessKey}`;
    const response = await axios.get(url);
    return response.data;
}

app.get('/geoip', async (req, res) => { 
    const { ip } = req.query;

    try {
        const data = await getGeoIP(ip);
        return res.json({
            ip: data.ip,
            city: data.city,
            country: data.country_name,
            calling_code: data.location.calling_code
        });

    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar a geolocalização' });
    }
})


app.listen(port, () => {
    console.log(`Rodando na porta ${port}`);
})
