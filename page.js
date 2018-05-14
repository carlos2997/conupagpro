var http = require("http"),fs = require("fs");
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var readline = require('readline-sync');
var express = require('express')
var app = express()
var os = require('os');

var config = 
   {
     userName: 'carlosadmin@carlosadmin', // update me
     password: '@sistemas2997', // update me
     server: 'carlosadmin.database.windows.net', // update me
     options: 
        {
           database: 'temporal' //update me
           , encrypt: true
        }
   }
var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
     if (err) {
          console.log(err)
     }else{
          console.log("Success conection");
    }
});

function queryDatabase(cadena){ 
     console.log('Reading rows from the Table...');

       // Read all rows from table
     request = new Request(
          cadena,
             function(err, rowCount, rows) 
                {
                    console.log(rowCount + ' row(s) returned');
                }
            );

     request.on('row', function(columns) {
        columns.forEach(function(column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
         });
             });
     connection.execSql(request);
   }


app.get('/', function (req, res) {
	if(req.url.indexOf("favicon.ico") > 0){return;}

	fs.readFile("./webpage.html",function(err,html){
		var html_string = html.toString();
		var arreglo_parametros = [], parametros = {};
		var variables = html_string.match(/[^\{\}]+(?=\})/g);
		var nombre = "";
		if(req.url.indexOf("?") > 0){
			var url_data = req.url.split("?");
			var arreglo_parametros = url_data[1].split("&");
		}
		for(var i = arreglo_parametros.length - 1; i >= 0 ; i--){
			var parametro = arreglo_parametros[i];
			var param_data = parametro.split("=");
			parametros[param_data[0]] = param_data[1];
		}
		var cadena = 'INSERT INTO Personas (Nombres,Apellidos,Telefono,Empresa,Direccion,Correo) VALUES (\''+parametros['names']+'\',\''+parametros['lastnames']+'\','+ parametros['telephone']+',\''+parametros['companyName']+'\',\''+parametros['address']+'\',\''+parametros['email']+'\');';
		
		console.log(cadena);
	
		if(cadena.indexOf("undefined") > -1) {
			console.log("entro");
		}else{
			queryDatabase(cadena);
		}

		res.writeHeader(200,{"Content-Type":"text/html"});
		res.write(html_string);
		res.end();
	});
})
app.listen(3000, function () {
    console.log('Hello world app listening on port 3000!')
})
