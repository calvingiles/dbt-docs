'use strict';

const angular = require('angular');
const _ = require('underscore');

require("./styles.css");

angular
.module('dbt')
.controller('MacroCtrl', ['$scope', '$state', 'project', 'code', '$transitions', '$anchorScroll', '$location',
            function($scope, $state, projectService, codeService, $transitions, $anchorScroll, $location) {

    $scope.model_uid = $state.params.unique_id;
    $scope.tab = $state.params.tab;
    $scope.project = projectService;
    $scope.codeService = codeService;

    function getReferences(project, macro) {
        var references = _.filter(project.nodes, function(node) {
            if (node.depends_on && node.depends_on.macros && node.depends_on.macros.length) {
                if (_.contains(node.depends_on.macros, macro.unique_id)) {
                    return true;
                }
            }
            return false;
        });

        // TODO : include macros?
        return _.groupBy(references, 'resource_type');
    }

    $scope.macro = {};
    projectService.ready(function(project) {
        var macro = project.macros[$scope.model_uid];
        $scope.macro = macro;
        $scope.references = getReferences(project, macro);

        // adapter macros
        if ($scope.macro.is_adapter_macro) {
            var adapter = project.metadata.adapter_type;
            $scope.versions = macro.impls;
            if (macro.impls[adapter]) {
                $scope.default_version = adapter;
            } else if (macro.impls['default']) {
                $scope.default_version = 'default'
            } else {
                $scope.default_version = _.keys(macro.impls)[0];
            }
        } else {
            $scope.default_version = "Source"
            $scope.versions = {Source: $scope.macro.macro_sql};
        }
    })
}]);
