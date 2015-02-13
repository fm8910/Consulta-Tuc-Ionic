var app = angular.module('starter', ['ionic', 'myApp.services', 'myApp.controllers']);

app.run(function(CreateBD) {
// CreateBD.delBD();
  CreateBD.init();

});
app.controller('consultar', function ($scope ,$rootScope, $http, $ionicLoading,$ionicPopup,tbUsuario){
	var tarjeta;
  var saldo;
 $scope.data = {};
	$scope.buscar= function(){
		tarjeta=  $scope.inbuscar;
		
	
	if (tarjeta!= undefined){
        
    $ionicLoading.show({
      template: 'Cargando...'
    });
  
var request = $http({
    method: 'POST',    
    url: 'http://tuc.alwaysdata.net/tuconsulta/proxy.php',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    },
    data: {codigo: $scope.inbuscar}
});
request.success(
    function( html ) {
     var inicio= html.indexOf("C$") + 2;
     var fin= html.length -5 ;
     saldo= parseFloat(html.substring(inicio,fin));
    $ionicLoading.hide();
    $ionicPopup.alert({
     title: '',
     template: html
   });
   

    }
    );
    }else{
       $ionicPopup.alert({
     title: 'Error',
     template: 'Ingrese un numero de tarjeta'
   });
    }

            }
    $scope.save= function(){

tarjeta=  $scope.inbuscar;
if (tarjeta!=undefined) {
  
  if (saldo==undefined) {
      saldo=0.0;
  }
      var mypopup=  $ionicPopup.show({
    template: '<input type="text" ng-model="data.nombre">',
    title: 'Guardar tarjeta',
    subTitle: 'Ingrese el nombre',
    scope: $scope,
    buttons: [
      { text: 'Cancelar' },
      {
        text: '<b>guardar</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.nombre) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data.nombre;
          }
        }
      },
    ]
  });
      mypopup.then(function(res){
        if (res!=undefined) {
          tbUsuario.insertUser(res,tarjeta,saldo);
           var result= tbUsuario.all();
           result.then(function(datos){
            $rootScope.$broadcast('saveuser',datos);
            });
        }     
      });

}else{
   $ionicPopup.alert({
     title: 'Error',
     template: 'Ingrese un numero de tarjeta'
   });
}
    }
});

app.controller('usuario', function($scope,$http,$ionicLoading,$ionicPopup,tbUsuario){
  $scope.$on('saveuser', function (event, data) {
    $scope.resultado=data;
  console.log(data); // 'Data to send'
});
 var ruser= tbUsuario.all();
 ruser.then(function(datos){
      $scope.resultado= datos;
 }); 
 $scope.buscar= function(numero){
      
   $ionicLoading.show({
      template: 'Cargando...'
    });
  
var request = $http({
    method: 'POST',
    url: 'http://tuc.alwaysdata.net/tuconsulta/proxy.php',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    },
    data: {codigo: numero}
});
request.success(
    function( html ) {
     var inicio= html.indexOf("C$") + 2;
     var fin= html.length -5 ;
     saldo= parseFloat(html.substring(inicio,fin));
    $ionicLoading.hide();
    tbUsuario.updateById(saldo,numero);
    var ruser= tbUsuario.all();
ruser.then(function(datos){
      $scope.resultado= datos;
 }); 
    }
    );
 
   }

 $scope.eliminar= function(numero){
  if (numero!=undefined) {
   tbUsuario.delById(numero);
   var ruser= tbUsuario.all(); 
ruser.then(function(datos){
      $scope.resultado= datos;
 }); 
  }
  
 }
});




