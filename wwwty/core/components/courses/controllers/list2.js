// (C) Copyright 2015 Martin Dougiamas
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

angular.module('mm.core.courses')

/**
 * Controller to handle the courses list.
 *
 * @module mm.core.courses
 * @ngdoc controller
 * @name mmCoursesListCtrl
 */
.controller('mmCoursesListCtrl2', function($scope, $mmCourses, $mmCoursesDelegate, $mmUtil, $mmEvents, $mmSite, $q,
            mmCoursesEventMyCoursesUpdated, mmCoreEventSiteUpdated,$stateParams,$programfactory) {

   
    
    $programfactory.getprogram().then(function(res){
        
        $scope.programsname=res.data;
       //alert($scope.programsname);
       // alert($scope.programsname.length);
       // console.log("abcd",$scope.programsname);

    }).catch(function(e){
        $mmUtil.showErrorModalDefault(error, 'mm.courses.errorloadcourses', true);
    })

    // Convenience function to fetch courses.
   

  

    

    

    

   

   
}).factory("$programfactory",function($http,$mmSite){
    var siteinfo1 = $mmSite.getInfo();
    return {
        getprogram:getprogram
    }
    function getprogram(){
        
        return $http.get(siteinfo1.siteurl+"/webservice/rest/server.php?wstoken="+localStorage.getItem('token')+"&wsfunction=core_view_programs&userid="+siteinfo1.userid+"&moodlewsrestformat=json").then(function (res){
            return res;

        }).catch(function(e){
            return e;
        })

    }
});
