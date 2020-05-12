const express = require('express'),
    fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    app = express();

// Escolhendo no metodo .get() o caminho para fazer a requisição
// Poderia ser somente a barra, mas para facilitar a compreensão vamos personalizar
app.get('/scraping', function(req, res) {

    // Url a ser feita a scraping de dados
    url = 'http://www.portaldatransparencia.gov.br/orgaos-superiores';

    // Metodo que faz a requisição para tratarmos (scraping) os dados
    request(url, function(error, response, html) {

        if (!error) {
            // Preparando o cheeriojs para ler o DOM ~ le jQuery selector
            let $ = cheerio.load(html);

            // Objeto que ira armazenar a tabela
            let resultado = [];

            // Escolhendo a tabela para fazer a scraping
            // e percorrendo as linhas 
            $('.grafico-tabela--sem-margem-inferior tr:not(:first-child)').each(function(i) {
                
                // Obtendo as propriedades do objeto
                let orgao = $(this).find('td').eq(0).text().trim(),
                orcamento = $(this).find('td').eq(1).text().trim(),
                valor = $(this).find('td').eq(2).text().trim(),
                percentual = $(this).find('td').eq(3).text().trim();
                
                // Inserindo os dados num array
                resultado.push({
                    orgao: orgao,
                    orcamento: orcamento,
                    valor: valor,
                    percentual : percentual
                });
                
            });
        }

        // Escrevendo o arquivo .json com o array 
        fs.writeFile('resultado.json', JSON.stringify(resultado, null, 4), function(err) {
            console.log('JSON escrito com sucesso! O arquivo está na raiz do projeto.')
        })

        res.send('Scraping gerado com sucesso! Verifique no seu node console.');
    })
})


// Execução do serviço
app.listen('8081')
console.log('Executando scraping de dados na porta 8081...');
exports = module.exports = app;
