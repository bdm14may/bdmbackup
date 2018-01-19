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

angular.module('mm.core.sidemenu')

/**
 * Controller to handle the side menu.
 *
 * @module mm.core.sidemenu
 * @ngdoc controller
 * @name mmSideMenuCtrl
 */
.controller('mmSideMenuCtrl', function($scope, $state, $mmSideMenuDelegate, $mmSitesManager, $mmSite, $mmEvents,
            $timeout, mmCoreEventLanguageChanged, mmCoreEventSiteUpdated, $mmSideMenu, $mmCourses,$ionicHistory,$programfactory) {

    $mmSideMenu.setScope($scope);
    $scope.handlers = $mmSideMenuDelegate.getNavHandlers();
    $scope.areNavHandlersLoaded = $mmSideMenuDelegate.areNavHandlersLoaded;
    loadSiteInfo();

    $programfactory.getprogram().then(function(res){
        
        $scope.programsname=res.data;
       //alert($scope.programsname);
       // alert($scope.programsname.length);
       // console.log("abcd",$scope.programsname);

    }).catch(function(e){
        return e;
    })
    $mmSitesManager.getSites().then(function(sites) {
        console.log(sites,'sites');
        $scope.sites=sites;
        // Remove protocol from the url to show more url text.
        sites = sites.map(function(site) {
            site.siteurl = site.siteurl.replace(/^https?:\/\//, '');
            site.badge = 0;
           
            return site;
        });

        // Sort sites by url and fullname.
        //$scope.sites = $mmSitesManager.sortSites(sites);

        $scope.data = {
            hasSites: sites.length > 0,
            showDelete: false
        };
    });
    //var site = $scope.sites,
   // sitename = site[0].sitename;

    $scope.logout = function() {
        $mmSitesManager.logout().finally(function() {
            //$state.go('mm_login.site');
           

        
           
                $mmSitesManager.deleteSite($scope.sites[0].id).then(function() {
                    $scope.sites.splice(0, 1);
                    $mmSitesManager.hasNoSites().then(function() {
                        // No sites left, go to add a new site s
                        
                        $ionicHistory.nextViewOptions({disableBack: true});
                        $state.go('mm_login.site');
                    });
                }, function() {
                    $log.error('Delete site failed');
                    $mmUtil.showErrorModal('mm.login.errordeletesite', true);
                });
            });
        
    
        
    };

    function loadSiteInfo() {
        var config = $mmSite.getStoredConfig();

        $scope.siteinfo = $mmSite.getInfo();
        $scope.logoutLabel = 'mm.sidemenu.' + (config && config.tool_mobile_forcelogout == "1" ? 'logout': 'changesite');
        $scope.showWeb = !$mmSite.isFeatureDisabled('$mmSideMenuDelegate_website');
        $scope.showHelp = !$mmSite.isFeatureDisabled('$mmSideMenuDelegate_help');

        $mmSite.getDocsUrl().then(function(docsurl) {
            $scope.docsurl = docsurl;
        });

        $mmSideMenu.getCustomMenuItems().then(function(items) {
            $scope.customItems = items;
        });
    }

    function updateSiteInfo() {
        // We need to use $timeout to force a $digest and make $watch notice the variable change.
        $scope.siteinfo = undefined;
        $timeout(function() {
            loadSiteInfo();
        });
    }

    var langObserver = $mmEvents.on(mmCoreEventLanguageChanged, updateSiteInfo);
    var updateSiteObserver = $mmEvents.on(mmCoreEventSiteUpdated, function(siteid) {
        if ($mmSite.getId() === siteid) {
            updateSiteInfo();
        }
    });

    // Required for Electron app so the title doesn't change.
    $scope.$on('$ionicView.afterEnter', function(ev) {
        ev.stopPropagation();
    });

    $scope.$on('$destroy', function() {
        if (langObserver && langObserver.off) {
            langObserver.off();
        }
        if (updateSiteObserver && updateSiteObserver.off) {
            updateSiteObserver.off();
        }
    });
})
.factory("$programfactory",function($http,$mmSite){
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
})