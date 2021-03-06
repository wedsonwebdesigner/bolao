app.
service('sessoes', function($http){
	return function(response){	
		for(x in response){
			sessionStorage.setItem(x, response[x]);
		}
	}
})

.service('replace', function(){
	return function(dados){
		var string = dados.replace('ã', 'a');
		var string = string.replace('á', 'a');
		var string = string.replace('â', 'a');
		var string = string.replace('é', 'e');
		var string = string.replace('õ', 'o');
		var string = string.replace('ó', 'o');
		var string = string.replace('ú', 'u');
		var string = string.replace('ç', 'c');
		
		return string;
	}
})

.service('gerarpdf', function($filter, config, replace){
	return function(clientes){		
			var text = '<strong style="font-family: Arial; font-size: 0.7em; display:block; text-align: center; margin-bottom: 10px; text-transform: uppercase;">' + config.empresa + '</strong>';
			text += '<strong style="font-family: Arial; font-size: 0.7em; margin-bottom: 3px;">Id: <span style="text-transform: capitalize;">' + clientes._id + '</span></strong><br>';
			text += '<strong style="font-family: Arial; font-size: 0.7em; margin-bottom: 3px;">Agente: <span style="text-transform: capitalize;">' + clientes.nagente + '</span></strong><br>';
			text += '<strong style="font-family: Arial; font-size: 0.7em; margin-bottom: 3px;">Cliente: <span style="text-transform: capitalize;">' + clientes.nome + '</span></strong><br>';
			text += '<strong style="font-family: Arial; font-size: 0.7em; display:block; margin-bottom: 30px;">Horário: <span>' + $filter('date')(clientes.horario, 'short') + '</span></strong>';

			text += '<strong style="font-family: Arial; font-size: 0.8em; display:block; text-align: center; margin-bottom: 10px; text-transform: uppercase;">' + clientes.nbolao + '</strong>';
			for(x in clientes.apostas){
				text += '<span style="font-family: Arial; font-size: 0.7em; font-weight:bold; display:block; padding: 5px; text-align:center;">' 
					+ clientes.apostas[x].casa + ' ' + clientes.apostas[x].pcasa 
					+ '  x  ' 
					+ ' ' + clientes.apostas[x].pfora + ' ' + clientes.apostas[x].fora +
				'</span>';
				text += '<span style="font-family: Arial; font-size: 0.7em; font-weight:bold; display:block; text-align:center;"> ' + $filter('date')(clientes.apostas[x].horario, 'short') + ' </span>';
			}		
		
			var x = 0;
			text += '<div style="font-family: Arial; font-size: 0.7em; display: block; text-align:left; margin: 20px 0;">';
				while(x < clientes.lugares.length){
					text += (x + 1) + ' Lugar ' + clientes.lugares[x] + ' % do valor acumulado.<br>';
					x++;
				}
			text += '</div>';

			text += '<div style="font-family: Arial; font-size: 0.7em; display: block; text-align:left;">';
				text += '- Esse bolao fecha suas apostas em ' + $filter('date')(clientes.hora.abertura, 'medium') + ' e finaliza em ' + $filter('date')( clientes.hora.fechamento, 'medium') + '.<br>';
				text += '- Placar EXATO vale 15 pontos, acertou o TIME mas não o placar 5 pontos.<br>';
				text += '- O premio sera pago ate 3 dias depois do ultimo jogo do bolao.<br>';
				text += '- Premio nao sera pago por erros de sistema.<br>';
				text += '- Em caso de empate na mesma posicao serao dividido o valor da premiacao.';
			text += '</div>';
		
		return text;
	}
})

.service('comprovante', function($filter, config, replace){
	return function(dados){	
		var ESC = "\u001B";
		var GS = "\u001D";
		var INI = ESC + "@";   //inicializa a impressora
		var NEGRITO = ESC + "E" + "1";  //inicializa o negrito...para finalizar o negrito utilize Ini
		var DOUBLEON = GS + "!" + "\u0001"; //inicializa dobra o tamanho da fonte... para finalizar utilize ini
		var ENTER = String.fromCharCode(0x0A);  //LF funciona para pular a linha
		var CENTRO = ESC + "a" + "1";  //inicializa centralizar para finalizar utilize ini
		var LEFT = ESC + "a" + "0";  //alinha a esquerca
		var REVERSO = GS + "B" + "1";  //fundo negro e letras transparantes
		var SMALL = ESC + "!" + "\u0001";  //fonte menor
		
		
		var text = ENTER + CENTRO + NEGRITO + replace(config.empresa).toUpperCase() + ENTER + INI;
		text += ENTER + NEGRITO + 'ID : ' + dados._id + ENTER + INI;
		text += NEGRITO + 'CLIENTE : ' + dados.nome + ENTER + INI;
		text += NEGRITO + 'AGENTE : ' + dados.nagente + ENTER + INI;
		text += NEGRITO + 'HORARIO : ' + $filter('date')(dados.horario, 'short') + ENTER + INI;
		
		text += ENTER + CENTRO + NEGRITO + replace(dados.nbolao).toUpperCase() + ENTER + INI;
		
		for(x in dados.apostas){
			text += ENTER + CENTRO + NEGRITO + replace(dados.apostas[x].casa).toUpperCase() + ' ' + dados.apostas[x].pcasa + ' x ' + dados.apostas[x].pfora + ' ' + replace(dados.apostas[x].fora).toUpperCase() + ENTER + INI;
			text += CENTRO + NEGRITO + $filter('date')(dados.apostas[x].horario, 'short') + ENTER + INI;
		}
		
		text += ENTER + ENTER + INI;		
		
		var x = 0;
		while(x < dados.lugares.length){
			text += NEGRITO + (x + 1) + ' Lugar ' + dados.lugares[x] + ' % do valor acumulado.' + ENTER + INI;
			x++;
		}
		
		text += ENTER + ENTER + INI;		
		
		text += NEGRITO + '- Esse bolao fecha suas apostas em ' + $filter('date')(dados.hora.abertura, 'medium') + ' e finaliza em ' + $filter('date')( dados.hora.fechamento, 'medium') + '.' + ENTER + INI;
		text += NEGRITO + '- Placar EXATO vale 15 pontos, acertou o TIME mas não o placar 5 pontos.' + ENTER + INI;
		text += NEGRITO + '- O premio sera pago ate 3 dias depois do ultimo jogo do bolao.' + ENTER + INI;
		text += NEGRITO + '- Premio nao sera pago por erros de sistema.' + ENTER + INI;
		text += NEGRITO + '- Em caso de empate na mesma posicao serao dividido o valor da premiacao.' + ENTER + INI;
		
		text += ENTER + ENTER + ENTER + INI;
		
		return text;
	}
})

.service('tabela', function($filter, config, replace){
	return function(dados){
		console.log(dados)
		var ESC = "\u001B";
		var GS = "\u001D";
		var INI = ESC + "@";   //inicializa a impressora
		var NEGRITO = ESC + "E" + "1";  //inicializa o negrito...para finalizar o negrito utilize Ini
		var DOUBLEON = GS + "!" + "\u0001"; //inicializa dobra o tamanho da fonte... para finalizar utilize ini
		var ENTER = String.fromCharCode(0x0A);  //LF funciona para pular a linha
		var CENTRO = ESC + "a" + "1";  //inicializa centralizar para finalizar utilize ini
		var LEFT = ESC + "a" + "0";  //alinha a esquerca
		var REVERSO = GS + "B" + "1";  //fundo negro e letras transparantes
		var SMALL = ESC + "!" + "\u0001";  //fonte menor		
		
		var text = ENTER + CENTRO + NEGRITO + replace(dados.nome).toUpperCase() + ENTER + INI;
		
		var confronto = function(confronto){
			return confronto != null ? confronto : ' ';
		}
		
		for(x in dados.confrontos){
			text += ENTER + CENTRO + NEGRITO + replace(dados.confrontos[x].casa).toUpperCase() + '  ' + confronto(dados.confrontos[x].pcasa) + ' x ' + confronto(dados.confrontos[x].pfora) + '  ' + replace(dados.confrontos[x].fora).toUpperCase() + ENTER + ENTER + INI;
			text += CENTRO + NEGRITO + $filter('date')(dados.confrontos[x].horario, 'short') + ENTER + INI;
		}
		
		text += ENTER + ENTER + INI;		
		
		var x = 0;
		while(x < dados.lugares.length){
			text += NEGRITO + (x + 1) + ' Lugar ' + dados.lugares[x] + ' % do valor acumulado.' + ENTER + INI;
			x++;
		}
		
		text += ENTER + ENTER + INI;		
		
		text += NEGRITO + '- Esse bolao fecha suas apostas em ' + $filter('date')(dados.hora.abertura, 'medium') + ' e finaliza em ' + $filter('date')( dados.hora.fechamento, 'medium') + '.' + ENTER + INI;
		text += NEGRITO + '- Placar EXATO vale 15 pontos, acertou o TIME mas não o placar 5 pontos.' + ENTER + INI;
		text += NEGRITO + '- O premio sera pago ate 3 dias depois do ultimo jogo do bolao.' + ENTER + INI;
		text += NEGRITO + '- Premio nao sera pago por erros de sistema.' + ENTER + INI;
		text += NEGRITO + '- Em caso de empate na mesma posicao serao dividido o valor da premiacao.' + ENTER + INI;
		
		text += ENTER + ENTER + ENTER + INI;
		
		return text;
	}
})

.service('mensagem', function($ionicPopup){
	return function(titulo, mensagem){	
		return $ionicPopup.alert({
			title : titulo,
			template : mensagem
		});
	}
})