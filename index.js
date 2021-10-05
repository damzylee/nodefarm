const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplates');

////////////////////////////////
//FILES

//Blocked Synchronous way
// const fileIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(fileIn);

// const fileOut = `This is what you need to know about avocado: ${fileIn}.\nCreated On: ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', fileOut);
// console.log("File written successfully!")

//Un-Blocked Asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//     if (err) return console.log('ERROR 😔')
//     fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data1) => {
//         console.log(data1);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data2) => {
//             console.log(data2);
//             fs.writeFile('./txt/final.txt', `${data1}\n${data2}`, 'utf-8', err => {
//                 console.log('Written file')
//             })
//         })
//     })
// })
// console.log("Reading file....")

////////////////////////////////
//SERVER
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const overview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const card = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const productTemplate = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const slugs = dataObj.map(el => slugify(el.productName, {lower: true}));

console.log(slugs);

const server = http.createServer((req, res) => {
    const { query, pathname} = url.parse(req.url, true);

    //Overview Page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const cardHtml = dataObj.map(el => replaceTemplate(card, el)).join('');
        const overviewHtml = overview.replace(/{%PRODUCT_CARD%}/g, cardHtml);
        res.end(overviewHtml);
    }
    //Product Page
    else if(pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTemplate(productTemplate, product);
        res.end(output);
    }
    //API Page
    else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        })
        res.end(data);
    }
    //Error Page
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-header-name': 'Hello, world'
        });
        res.end("<h1>Page not found</h1>");
    }
});

server.listen(8000, "127.0.0.1", () => {
    console.log("Listening to port 8000");
});