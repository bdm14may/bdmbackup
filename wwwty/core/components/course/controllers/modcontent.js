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

angular.module('mm.core.course')

/**
 * Mod content controller.
 *
 * @todo MDL-50114 The description might be missing because this data is based on the course
 *       contents which does not always include it.
 * @module mm.core.course
 * @ngdoc controller
 * @name mmCourseModContentCtrl
 */
.controller('mmCourseModContentCtrl', function($log, $stateParams, $scope, $mmCourseDelegate, $mmCourse, $translate, $mmText,$sce,$cordovaInAppBrowser,$rootScope,$ionicNavBarDelegate,$mmSite,$http) {
    $log = $log.getInstance('mmCourseModContentCtrl');
    var module = $stateParams.module || {};
    console.log(module,"module");
    $scope.moduleer=module;
    $scope.siteinfo = $mmSite.getInfo();
    console.log( $scope.siteinfo," $scope.siteinfo");
    if(module.completionstatus.modname=="feedback"){
      $http.get($scope.siteinfo.siteurl+'/webservice/rest/server.php?wstoken=' + localStorage.getItem('token') + '&wsfunction=mod_feedback_completed&feedbackid=' + module.instance + '&userid=' + $scope.siteinfo.userid + '&moodlewsrestformat=json').then(function (res) {
        
        
        if (res.data.completed == 'Completed') {
            $scope.isCompleted = true;
        } else {
            $scope.isCompleted = false;
            var url = $scope.siteinfo.siteurl+'/webservice/rest/server.php?wstoken=' + localStorage.getItem('token') + '&wsfunction=mod_get_feedback_item&feedbackid=' + module.instance + '&moodlewsrestformat=json'
            $http.get(url).then(function (res) {
                console.log(res);
                $scope.questionList = res.data[0].feedbackitems;

                String.prototype.ltrim0 = function() {
                  return this.replace(/^[r]+/,"");
                 }
                 

                angular.forEach($scope.questionList, function (item) {
                    
                    item.choices=item.choices.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,' ');
                    item.choices=item.choices.ltrim0();
                    item.choices.replace(/ /g, ' ');
                    item.choices = item.choices.split("|");

                })
                console.log($scope.questionList)
            }, function (error) {
                console.log(error);
            })
        }

    });
    
  }
  $scope.userChoice = [];
  $scope.submitAnswers = function (data) {
    var temp = {};
    $scope.userRes = {}
    for (var i = 0; i < $scope.userChoice.length; i++) {

        if (i == 0)
            temp = {
                "responses[0][name]": $scope.questionList[i].type + '_' + $scope.questionList[i].id,
                "responses[0][value]": data[i]
            }
        if (i == 1)
            temp = {
                "responses[1][name]": $scope.questionList[i].type + '_' + $scope.questionList[i].id,
                "responses[1][value]": data[i]
            }
        if (i == 2)
            temp = {
                "responses[2][name]": $scope.questionList[i].type + '_' + $scope.questionList[i].id,
                "responses[2][value]": data[i]
            }
        if (i == 3)
            temp = {
                "responses[3][name]": $scope.questionList[i].type + '_' + $scope.questionList[i].id,
                "responses[3][value]": data[i]
            }
        if (i == 4)
            temp = {
                "responses[4][name]": $scope.questionList[i].type + '_' + $scope.questionList[i].id,
                "responses[4][value]": data[i]
            }
        if (i == 5)
            temp = {
                "responses[5][name]": $scope.questionList[i].type + '_' + $scope.questionList[i].id,
                "responses[5][value]": data[i]
            }

        $scope.userRes = Object.assign({}, $scope.userRes, temp);
        console.log($scope.userRes)
    }

    var usertemp = {
        'feedbackid':module.instance,
        'userid':$scope.siteinfo.userid ,
        'courseid': module.completionstatus.courseId
    }
    $scope.userRes = Object.assign({}, $scope.userRes, usertemp);
    console.log($scope.userRes)

   

    var url = $scope.siteinfo.siteurl+'/webservice/rest/server.php?wstoken=' + localStorage.getItem('token') + '&wsfunction=mod_feedback_item_process_page&moodlewsrestformat=json';
    $http({
        method: 'POST',
        url: url,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function (obj) {
            var str = [];
            for (var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: $scope.userRes
    }).then(function (res) {
        console.log(res)
        $ionicNavBarDelegate.back();
        // if (res.data.Status == 'Success')
       
    }, function (error) {
        console.log(error);
    })
  }
    $scope.isDisabledInSite = $mmCourseDelegate.isModuleDisabledInSite(module.modname);
    $scope.isSupportedByTheApp = $mmCourseDelegate.hasContentHandler(module.modname);
    $scope.moduleName = $mmCourse.translateModuleName(module.modname);

    $scope.description = module.description;
    $scope.title = module.name;
    $scope.url = module.url;
    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
      }

      function getUrlVars() {
        var vars = {};
        var parts = $scope.url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
        });
        return vars;
        }


      $scope.openb=function(){
        var options = {
            location: 'no',
            clearcache: 'yes',
            toolbar: 'yes',
          };

          var params = $scope.url.split("?")[1].split("&");
          
      //var first = getUrlVars()["id"];
      //console.log(id);
    //alert(id);
    console.log($scope.siteinfo.siteurl+"/edlogin.php?"+params+"&username="+localStorage.getItem("username")+"&password="+localStorage.getItem("password")+"&browse=mobile");
          $cordovaInAppBrowser.open($scope.siteinfo.siteurl+"/edlogin.php?"+params+"&username="+localStorage.getItem("username")+"&password="+localStorage.getItem("password")+"&browse=mobile",'_blank', options)
            .then(function(event) {
              // success
            })
            .catch(function(event) {
              // error
            });
      

      }
      $rootScope.$on('$cordovaInAppBrowser:exit', function(e, event){
       // alert("i am exit");
        $ionicNavBarDelegate.back();
          });

    // Context Menu Description action.
    $scope.expandDescription = function() {
        $mmText.expandText($translate.instant('mm.core.description'), $scope.description, false);
    };
});
