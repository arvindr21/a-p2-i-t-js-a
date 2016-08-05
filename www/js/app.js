// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})



.controller('TodosCtrl', function(TodoRESTFactory, $scope, $ionicModal) {

    var id = Math.floor(Math.random() * 9999);

    $scope.opts = {
        shouldShowDelete: false
    }

    $scope.data = {};

    $scope.toggleDelete = function() {
        $scope.opts.shouldShowDelete = !$scope.opts.shouldShowDelete;
    }

    $scope.showNewModal = function() {
        $scope.modal.show();
    }

    $scope.createTodo = function() {
        // console.log($scope.data.todoText);
        TodoRESTFactory.post({
            id: id++,
            text: $scope.data.todoText
        }).then(function(response) {
            if (response.status === 201) {
                $scope.data.todoText = '';
                $scope.$broadcast('LoadTodos');
                $scope.modal.hide();
            }
        })
    }

    $scope.editTodo = function(todo) {
        $scope.currTodo = todo;
        $scope.data.todoText = $scope.currTodo.text;
        $scope.modal.show();
    }

    $scope.deleteTodo = function(todo) {
        TodoRESTFactory.delete(todo.id).then(function(response) {
            $scope.$broadcast('LoadTodos');
        })
    }

    $scope.updateTodo = function() {
        var todo = $scope.currTodo;
        todo.text = $scope.data.todoText;
        TodoRESTFactory
            .put(todo.id, todo)
            .then(function(response) {
                if (response.status === 200) {
                    $scope.data.todoText = '';
                    // $scope.$broadcast('LoadTodos');
                    $scope.modal.hide();
                }
            });
    }

    $scope.cancelCreate = function() {
        $scope.modal.hide();
        $scope.currTodo = undefined;
    }

    $ionicModal.fromTemplateUrl('new-todo.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });



    $scope.todos = [];

    $scope.$on('LoadTodos', function() {
        TodoRESTFactory
            .get()
            .then(function(response) {
                $scope.todos = response.data;
            })
    });

    $scope.$broadcast('LoadTodos');
})


.value('TODORESTURL', 'http://localhost:3000/todos')

.factory('TodoRESTFactory', function($http, TODORESTURL) {
    var API = {
        get: function() {
            return $http.get(TODORESTURL);
        },
        getOne: function(id) {
            return $http.get(TODORESTURL + '/' + id);
        },
        post: function(todo) {
            return $http.post(TODORESTURL, todo);
        },
        put: function(id, todo) {
            return $http.put(TODORESTURL + '/' + id, todo);
        },
        delete: function(id) {
            return $http.delete(TODORESTURL + '/' + id);
        }

    }
    return API;
})
