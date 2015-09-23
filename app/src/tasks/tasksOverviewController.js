(function(){

    
    angular.module('openeApp.tasks')
        .controller('tasksOverviewController', TasksOverviewController);
    
    TasksOverviewController.$inject = [ '$scope', 'taskService' ];
    
    function TasksOverviewController($scope, taskService) {
        var vm = this;
        
        init();
        
        function init(){
            taskService.getCurrentUserWorkflowTasks().then(function(result){
                vm.tasks = result;
            });
        }
        
    }

})();
