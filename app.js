const {createServer} = require("http");

const methods = Object.create(null);

createServer((req, res) => {
    let handler = methods[req.method] || notAllowed;
    handler(req)
        .catch(error => {
            if(error.status != null) return error;
            return {body: String(error), status: 500};
        })
        .then(({body, status = 200, type = "text/plain"}) => {
            res.writeHead(status, {"Content-Type": type});
            if(body && body.pipe) body.pipe(res);
            else res.end(body)
        });
}).listen(8000);

async function notAllowed(req){
    return {
        status : 405, 
        body: `Method ${req.method} not allowed.`
    };
}