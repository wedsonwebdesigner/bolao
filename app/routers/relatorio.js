module.exports = function(app){
	app.get('/relatorio', app.middlewares.autenthication.autenthication, app.controllers.relatorio.registros);
    app.get('/relatorio/listar', app.middlewares.autenthication.autenthication, app.controllers.relatorio.listar);
}