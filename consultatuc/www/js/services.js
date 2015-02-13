angular.module('myApp.services', ['myApp.config'])
// DB wrapper
.factory('CreateBD', function($q, DB_CONFIG) {
    var self = this;
    self.db = null;

    self.init = function() {
        // Use self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name}); in production
        self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', -1);

        angular.forEach(DB_CONFIG.tables, function(table) {
            var columns = [];

            angular.forEach(table.columns, function(column) {
                columns.push(column.name + ' ' + column.type);
            });

            var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
            self.query(query);
            console.log('Table ' + table.name + ' initialized');
        });
    };

    self.delBD= function(){
        self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', -1);
        var query= 'DROP TABLE usuarios';
        self.query(query);

    };

    self.query = function(query, bindings) {
        bindings = typeof bindings !== 'undefined' ? bindings : [];
        var deferred = $q.defer();

        self.db.transaction(function(transaction) {
            transaction.executeSql(query, bindings, function(transaction, result) {
                deferred.resolve(result);
            }, function(transaction, error) {
                console.log(error);
                deferred.reject(error);
            });
        });

        return deferred.promise;
    };

    self.fetchAll = function(result) {
        var output = [];

        for (var i = 0; i < result.rows.length; i++) {
            output.push(result.rows.item(i));
        }
        console.log(output);
        return output;
    };

    self.fetch = function(result) {
        return result.rows.item(0);
    };

    return self;
})
// Resource service example
.factory('tbUsuario', function(CreateBD) {
    var self = this;
    self.insertUser= function (usuario,tarjeta,saldo){
        return CreateBD.query('INSERT INTO usuarios (numero, nombre,saldo) VALUES (?,?,?)',[tarjeta,usuario,saldo])
        .then(function(result){
            return CreateBD.fetchAll(result);
        });
    };
    self.all = function() {
        return CreateBD.query('SELECT * FROM usuarios')
        .then(function(result){
            return CreateBD.fetchAll(result);
        });
    };
    
    self.getById = function(tarjeta) {
        return CreateBD.query('SELECT * FROM usuarios WHERE numero = ?', [tarjeta])
        .then(function(result){
            return CreateBD.fetch(result);
        });
    };
    self.delById = function(tarjeta){
        return CreateBD.query('DELETE FROM usuarios WHERE numero = ?', [tarjeta])
        .then(function(result){
            return CreateBD.fetchAll(result);
        });
    };
    self.updateById= function(saldo,tarjeta){
        return CreateBD.query('UPDATE usuarios SET saldo=? WHERE numero = ?', [saldo,tarjeta])
        .then(function(result){
            return CreateBD.fetchAll(result);
        }); 
    };
    return self;
});