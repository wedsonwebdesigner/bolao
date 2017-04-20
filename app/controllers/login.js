module.exports = function(app){	
	return {
		entrar : function(req, res){
				var agentes = new app.models.schemas.agentes();
				app.models.schemas.agentes.findOne({ nome : req.body.nome }, function(err, resposta){
					agentes.comparar(req.body.senha, resposta.senha, function(err, comparar){
						if(comparar){
							req.session.usuarios = req.body;
							res.status(200).json({ resposta : true , mensagem : 'Acesso Permitido'});
						}else{
						   res.status(200).json({ resposta : false , mensagem : 'Login ou senha incorretos'});
						}
					});
				})				
		},
		
		sair : function(req, res){
			req.session.destroy(function(){
				res.json({ resposta : true });
				});		
		} 
	}
}