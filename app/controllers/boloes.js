module.exports = function(app){	
	var url = require('url');
	var pdf = require('html-pdf');
	
	var options = { format: 'A6' };
	return {		
		registros : function(req, res){
			var limite = parseInt(url.parse(req.url, true).query.limite);			
			var visivel = url.parse(req.url, true).query.visivel ? { visivel : 1 } : null;			
			
			var data = new Date();
			app.models.schemas.boloes.find().limit(limite).exec(function(err, resposta){
				res.status(200).json(resposta);
			})
		},
		
		todos : function(req, res){
			var limite = parseInt(url.parse(req.url, true).query.limite);			
			var visivel = url.parse(req.url, true).query.visivel ? { visivel : 1 } : null;			
			
			app.models.schemas.boloes.find().limit(limite).exec(function(err, resposta){
				res.status(200).json(resposta);
			})
		},
		
		registro : function(req, res){			
			app.models.schemas.boloes.findById(req.params.id, function(err, resposta){
				res.status(200).json(resposta);
			})
		},
		
		cadastrar : function(req, res){
			app.models.schemas.agentes.findOne({token : req.token}, function(err, resposta){
				if(err){
					res.status(500).json({resposta : false, mensagem : 'Houve algum problema tente novamente!', erro : err});
				}else if(resposta){
					app.models.schemas.boloes.create(req.body, function(err, resposta){
						res.status(200).json(resposta);
					})
				}else{
					res.status(403).json({ resposta : false, me00nsagem : 'Talvez você não esteja logado!'});
				}
			})					
		},
		
		pdf : function(req, res){
			pdf.create(req.body.html, options).toFile('./comprovantes/' + req.body.apostador + '.pdf', function(err, resp) {
			  if (err) return console.log(err);
			  res.status(200).json({resposta : true });			
			});
		},
		
		alterar : function(req, res){	
			app.models.schemas.agentes.findOne({token : req.token}, function(err, resposta){
				if(err){
					res.status(500).json({resposta : false, mensagem : 'Houve algum problema tente novamente!', erro : err});
				}else if(resposta){
					app.models.schemas.boloes.findById(req.params.id, function(err, resposta){
						resposta.nome = req.body.nome;
						resposta.valor = req.body.valor;
						resposta.confrontos = req.body.confrontos;
						resposta.lugares = req.body.lugares;
						resposta.porcentagem = req.body.porcentagem;
						resposta.save(function(){
							res.status(200).json(resposta);
							});
					})
				}else{
					res.status(403).json({ resposta : false, mensagem : 'Talvez você não esteja logado!'});
				}
			})	
		},
		
		
		visivel : function(req, res){	
			app.models.schemas.agentes.findOne({token : req.token}, function(err, resposta){
				if(err){
					res.status(500).json({resposta : false, mensagem : 'Houve algum problema tente novamente!', erro : err});
				}else if(resposta){
					app.models.schemas.boloes.findById(req.params.id, function(err, resposta){
						resposta.visivel = req.body.visivel;
						resposta.save(function(){
							res.status(200).json(resposta);
							});
					})
				}else{
					res.status(403).json({ resposta : false, mensagem : 'Talvez você não esteja logado!'});
				}
			})	
		},
		
		deletar : function(req, res){
			app.models.schemas.agentes.findOne({token : req.token}, function(err, resposta){
				if(err){
					res.status(500).json({resposta : false, mensagem : 'Houve algum problema tente novamente!', erro : err});
				}else if(resposta){
					app.models.schemas.boloes.remove({_id : req.params.id }, function(err, resposta){
						if(resposta){
							app.models.schemas.apostador.find({ bolao : req.params.id }).remove(function(err, resposta){			
								res.status(200).json(resposta);
								})
							}						
					})
				}else{
					res.status(403).json({ resposta : false, mensagem : 'Talvez você não esteja logado!'});
				}
			})	
		}
	}
}