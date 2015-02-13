angular.module('myApp.config', [])
.constant('DB_CONFIG', {
    name: 'tucBD',
    size: 3 * 1024 * 1024, // 3MB
    tables: [
      {
            name: 'usuarios',
            columns: [
                {name: 'numero', type: 'text primary key'},
                {name: 'nombre', type: 'text'},
                {name: 'saldo', type: 'double'}
                
            ]
        }
    ]
});