var myApp = angular.module('groceryListApp', ['ngRoute']);

myApp.controller('HomeController', ['$scope', '$location', '$route', '$routeParams', function($scope, $location, $route, $routeParams){
	$scope.$location = $location;
	console.log($location.path());
}])

.controller('groceryListController', ['$scope', '$location', 'itemsService', function($scope, $location, itemsService){
	$scope.groceryList = {};
	$scope.groceryList.items = itemsService.getItemList();

	$scope.groceryList.completed = [];

	$scope.toggleComplete = function(index){
		$scope.groceryList.completed[index] = !$scope.groceryList.completed[index];
		
	}

	$scope.editItem = function(index){
		$location.path("/addItem/" + index);

	}

	$scope.deleteItem = function(index){
		$scope.groceryList.items.splice(index, 1);
	}
	
}])

.controller('addItemController', ['$scope', '$location', '$window', '$routeParams', 'itemsService', function($scope, $location, $window, $routeParams, itemsService){
	$scope.grocery = {};
	console.log("params " + $routeParams.itemIndex);


	$scope.grocery.item = itemsService.getItem($routeParams.itemIndex);

	$scope.addItem = function(){
		if($routeParams.itemIndex === undefined){
			itemsService.addItem($scope.grocery.item);			
		}
		else{
			itemsService.replaceItem($routeParams.itemIndex, $scope.grocery.item);	
		}

		$location.path("/");
	};

	$scope.cancelAddingItem = function(){
		$location.path("/");
	}
}])

.config(function($routeProvider, $locationProvider){
	$routeProvider
	
	.when('/', {
		
		templateUrl: 'views/groceryList.html',
		controller: 'groceryListController'
	})

	.when('/addItem/:itemIndex?', {
		templateUrl: 'views/addItem.html',
		controller: 'addItemController'
	})
	.otherwise({redirectTo: '/'})
	;
	
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});

})

.factory('itemsService', function(){
	var itemList = [];
	var itemsInstance = {
		addItem: function(item){
			if(item && itemList.indexOf(item) == -1){
				itemList.push(item);
			}
		},
	    getItemList: function(){
	    	return itemList;
	    },

	    getItem: function(index){
	    	return itemList[index];
	    },

	    replaceItem: function(index, item){
	    	if(itemList.indexOf(item) == -1){
	    		itemList[index] = item;	    		
	    	}

	    }
	};
	return itemsInstance;
})
;
