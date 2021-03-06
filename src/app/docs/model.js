'use strict';

const angular = require('angular');
require("./styles.css");

angular
.module('dbt')
.controller('ModelCtrl', ['$scope', '$state', 'project', 'code', '$anchorScroll', '$location',
            function($scope, $state, projectService, codeService, $anchorScroll, $location) {

    $scope.model_uid = $state.params.unique_id;
    $scope.tab = $state.params.tab;
    $scope.project = projectService;
    $scope.codeService = codeService;

    $scope.versions = {}

    $scope.copied = false;
    $scope.copy_to_clipboard = function(sql) {
        codeService.copy_to_clipboard(sql)
        $scope.copied = true;
        setTimeout(function() {
            $scope.$apply(function() {
                $scope.copied = false;
            })
        }, 1000);
    }

    $scope.model = {};
    projectService.ready(function(project) {
        $scope.model = project.nodes[$scope.model_uid];

        var default_compiled = '\n-- compiled SQL not found for this model\n';
        $scope.versions = {
            'Source': $scope.model.raw_sql,
            'Compiled': $scope.model.injected_sql || default_compiled
        }

        setTimeout(function() {
            $anchorScroll();
        }, 0);
    })


}]);
