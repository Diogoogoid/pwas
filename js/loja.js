var loja = angular.module('loja', ['ui.router']);

loja.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('principal', {
        url: '/',
        templateUrl: 'views/principal.html',
    });

    $stateProvider.state('produto', {
        url: '/produto/:id',
        templateUrl: 'views/produto.html',
        controller: 'produto'
    });

    $stateProvider.state('carrinho', {
        url: '/carrinho/:id?qtd',
        templateUrl: 'views/carrinho.html',
        controller: 'carrinho'
    });

    $urlRouterProvider.otherwise('/');
});

loja.controller('principal', function ($scope, $produtos) {
    $scope.min = 0;
    $scope.max = 10000;

    $scope.produtos = [];

    $produtos.carregarProdutos().then(function (produtos) {
        $scope.produtos = produtos;
    });

    $scope.filtro = function (produto) {
        return produto.preco >= $scope.min && produto.preco <= $scope.max;
    };
});

loja.controller('produto', function ($scope, $stateParams, $produtos) {
    $scope.produto = $produtos.getProduto($stateParams.id);
});

loja.controller('carrinho', function ($scope, $rootScope, $stateParams, $produtos) {
    if ($rootScope.carrinho) {
        var p = -1;
        verifica(parseInt($stateParams.id, 10));
        var prod = $produtos.getProduto($stateParams.id);
        if(p != 0){
            var aux = parseInt($stateParams.qtd, 10);
            for(var i = 0; i < $rootScope.carrinho.length; i++) {
                if($rootScope.carrinho[i].id == prod.id) {
                    $rootScope.carrinho[i].quantidade += aux;
                }
            }
        } else {
            prod.quantidade = parseInt($stateParams.qtd, 10);
            $rootScope.carrinho.push(prod);
        }
    } else {
        $rootScope.carrinho = [];
        var prod = $produtos.getProduto($stateParams.id);
        prod.quantidade = parseInt($stateParams.qtd, 10);
        $rootScope.carrinho.push(prod);
    }

    function verifica(id){
        for(var i = 0; i < $rootScope.carrinho.length; i++) {
            if($rootScope.carrinho[i].id === id) {
                p = -1;
                break;
            } else {
                p = 0;
            }
        }
    }
});

loja.factory('$produtos', function ($http, $q) {

    var produtos = [];

    function carregarProdutos() {
        return $q(function (resolve, reject) {
            if (produtos.length === 0) {
                $http.get('produtos.json').then(function (response) {
                    produtos = response.data;
                    resolve(produtos);
                });
            } else {
                resolve(produtos);
            }
        });
    }

    function getProduto(id) {
        var encontrado = null;

        for (var i = 0; i < produtos.length; i++) {
            var produto = produtos[i];
            if (produto.id == id) {
                encontrado = produto;
                break;
            }
        }

        return encontrado;
    }

    return {
        carregarProdutos,
        getProduto
    };

});