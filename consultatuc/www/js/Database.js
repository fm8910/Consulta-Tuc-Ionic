function onDeviceReady(){
	handlerBD();
}

function handlerBD(){

iniciaBD();
}

function iniciaBD(){
	var dbSize = 3 * 1024 * 1024; // 3MB
	var db = window.openDatabase("tucBD", "1.0", "numeros TUC", dbSize);
	db.transaction(populateDB, errorCB, successCB);
}
function populateDB(tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS usuario (numero INTEGER PRIMARY KEY, nombre TEXT NOT NULL, saldo DOUBLE not null)'); 
	tx.executeSql('INSERT INTO usuario (numero, nombre,saldo) VALUES (\"' + new_idGet + '\"' + ', \"' + formdata1Get + '\", \"' + formdata2Get + '\", \"' + formdata3Get + '\")');
}