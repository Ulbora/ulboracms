'use strict';

/* Services */

var ulboraCmsAdminServices = angular.module('ulboraCmsAdminServices', ['ngResource', 'ngCookies']);

ulboraCmsAdminServices.factory('Challenge', ['$resource',
    function($resource) {
        return $resource("../rsuser/getChallenge", {}, {
            getChallenge: {method: 'GET', params: {languageCode: "en_US"}, isArray: false}
        });
    }]);

ulboraCmsAdminServices.factory('Login', ['$resource',
    function($resource) {
        return $resource("../rs/public/login", {}, {
        });
    }]);

ulboraCmsAdminServices.factory('ArticleValues', ['$resource',
    function($resource) {
        return $resource("../rs/article/values", {}, {
            getValues: {method: 'POST', cache: false, params: {}, isArray: false}
        });
    }]);


ulboraCmsAdminServices.factory('ArticleList', ['$resource',
    function($resource) {
        return $resource("../rs/article/list", {}, {
            getArticleList: {method: 'POST', cache: false, isArray: true}
        });
    }]);

ulboraCmsAdminServices.factory('Article', ['$resource',
    function($resource) {
        return $resource("../rs/article/:id", {}, {
            get: {method: 'GET', cache: false, isArray: false},
            save: {method: 'POST', cache: false, isArray: false},
            update: {method: 'PUT', cache: false, isArray: false},
            delete: {method: 'DELETE', cache: false, isArray: false}
        });
    }]);
//delete: {method: 'DELETE', cache : false, isArray: false, headers: {Authorization: 'Basic ' + getToken()}}

ulboraCmsAdminServices.factory('SectionList', ['$resource',
    function($resource) {
        return $resource("../rs/section/list", {}, {
            getSectionList: {method: 'POST', cache: false, isArray: true}
        });
    }]);

ulboraCmsAdminServices.factory('Section', ['$resource',
    function($resource) {
        return $resource("../rs/section/:id", {}, {
            //get: {method: 'GET', isArray: false, headers: {Authorization: 'Basic ' + getToken()}},
            save: {method: 'POST', cache: false, isArray: false},
            //update: {method: 'PUT', isArray: false, headers: {Authorization: 'Basic ' + getToken()}},
            delete: {method: 'DELETE', cache: false, isArray: false}
        });
    }]);

ulboraCmsAdminServices.factory('CategoryList', ['$resource',
    function($resource) {
        return $resource("../rs/category/list", {}, {
            getCategoryList: {method: 'POST', cache: false, isArray: true}
        });
    }]);



ulboraCmsAdminServices.factory('Category', ['$resource',
    function($resource) {
        return $resource("../rs/category/:id", {}, {
            //get: {method: 'GET', isArray: false, headers: {Authorization: 'Basic ' + getToken()}},
            save: {method: 'POST', cache: false, isArray: false},
            //update: {method: 'PUT', isArray: false, headers: {Authorization: 'Basic ' + getToken()}},
            delete: {method: 'DELETE', cache: false, isArray: false}
        });
    }]);







ulboraCmsAdminServices.factory('LanguageList', ['$resource',
    function($resource) {
        return $resource("../rs/language/list", {}, {
            getLanguageList: {method: 'POST', cache: false, isArray: true}
        });
    }]);



ulboraCmsAdminServices.factory('Language', ['$resource',
    function($resource) {
        return $resource("../rs/language/:id", {}, {
            get: {method: 'GET', cache: false, isArray: false},
            save: {method: 'POST', cache: false, isArray: false},
            update: {method: 'PUT', cache: false, isArray: false},
            delete: {method: 'DELETE', cache: false, isArray: false}
        });
    }]);


ulboraCmsAdminServices.factory('LocationList', ['$resource',
    function($resource) {
        return $resource("../rs/location/list", {}, {
            getLocationList: {method: 'POST', cache: false, isArray: true}
        });
    }]);



ulboraCmsAdminServices.factory('Location', ['$resource',
    function($resource) {
        return $resource("../rs/location/:id", {}, {
            get: {method: 'GET', cache: false, isArray: false},
            save: {method: 'POST', cache: false, isArray: false},
            update: {method: 'PUT', cache: false, isArray: false},
            delete: {method: 'DELETE', cache: false, isArray: false}
        });
    }]);


ulboraCmsAdminServices.factory('LinkList', ['$resource',
    function($resource) {
        return $resource("../rs/link/list", {}, {
            getList: {method: 'POST', cache: false, isArray: true}
        });
    }]);



ulboraCmsAdminServices.factory('Link', ['$resource',
    function($resource) {
        return $resource("../rs/link/:id", {}, {
            get: {method: 'GET', cache: false, isArray: false},
            save: {method: 'POST', cache: false, isArray: false},
            update: {method: 'PUT', cache: false, isArray: false},
            delete: {method: 'DELETE', cache: false, isArray: false}
        });
    }]);



ulboraCmsAdminServices.factory('ConfigurationList', ['$resource',
    function($resource) {
        return $resource("../rs/configuration/list", {}, {
            getList: {method: 'POST', cache: false, isArray: true}
        });
    }]);



ulboraCmsAdminServices.factory('Configuration', ['$resource',
    function($resource) {
        return $resource("../rs/configuration/:id", {}, {
            get: {method: 'GET', cache: false, isArray: false},
            save: {method: 'POST', cache: false, isArray: false},
            update: {method: 'PUT', cache: false, isArray: false},
            delete: {method: 'DELETE', cache: false, isArray: false}
        });
    }]);

ulboraCmsAdminServices.factory('ProductList', ['$resource',
    function($resource) {
        return $resource("../rs/product/list", {}, {
            getList: {method: 'POST', cache: false, isArray: true}
        });
    }]);

ulboraCmsAdminServices.factory('Product', ['$resource',
    function($resource) {
        return $resource("../rs/product/:id", {}, {
            get: {method: 'GET', cache: false, isArray: false},
            save: {method: 'POST', cache: false, isArray: false},
            update: {method: 'PUT', cache: false, isArray: false},
            delete: {method: 'DELETE', cache: false, isArray: false}
        });
    }]);

ulboraCmsAdminServices.factory('MediaList', ['$resource',
    function($resource) {
        return $resource("../rs/media/list", {}, {
            getMediaList: {method: 'POST', cache: false, isArray: true}
        });
    }]);

ulboraCmsAdminServices.factory('MediaUpload', ['$resource',
    function($resource) {
        return $resource("../rs/media/upload", {}, {
            addMedia: {method: 'POST', cache: false, isArray: false, headers: {'Content-Type': 'multipart/form-data'}}
        });
    }]);

ulboraCmsAdminServices.factory('Media', ['$resource',
    function($resource) {
        return $resource("../rs/media/:id", {}, {
            get: {method: 'GET', cache: false, isArray: false},
            save: {method: 'POST', cache: false, isArray: false},
            update: {method: 'PUT', cache: false, isArray: false},
            delete: {method: 'DELETE', cache: false, isArray: false}
        });
    }]);

ulboraCmsAdminServices.factory('DownloadableFileList', ['$resource',
    function($resource) {
        return $resource("../rs/downloadableFile/list", {}, {
            getList: {method: 'POST', cache: false, isArray: true}
        });
    }]);

ulboraCmsAdminServices.factory('DownloadableFile', ['$resource',
    function($resource) {
        return $resource("../rs/downloadableFile/:id", {}, {
            get: {method: 'GET', cache: false, isArray: false},
            save: {method: 'POST', cache: false, isArray: false},
            update: {method: 'PUT', cache: false, isArray: false},
            delete: {method: 'DELETE', cache: false, isArray: false}
        });
    }]);

ulboraCmsAdminServices.factory('UserList', ['$resource',
    function($resource) {
        return $resource("../rs/user/list", {}, {
            getUserList: {method: 'POST', cache: false, isArray: true}
        });
    }]);

ulboraCmsAdminServices.factory('UserRoleList', ['$resource',
    function($resource) {
        return $resource("../rs/user/roleList", {}, {
            getUserRoleList: {method: 'POST', cache: false, isArray: true}
        });
    }]);

ulboraCmsAdminServices.factory('Password', ['$resource',
    function($resource) {
        return $resource("../rs/user/pw", {}, {
            change: {method: 'POST', cache: false, isArray: false}
        });
    }]);

ulboraCmsAdminServices.factory('User', ['$resource',
    function($resource) {
        return $resource("../rs/user/:id", {}, {
            get: {method: 'GET', cache: false, isArray: false},
            save: {method: 'POST', cache: false, isArray: false},
            update: {method: 'PUT', cache: false, isArray: false},
            delete: {method: 'DELETE', cache: false, isArray: false}
        });
    }]);

ulboraCmsAdminServices.factory('AdminSummary', ['$resource',
    function($resource) {
        return $resource("../rs/admin/summary", {}, {
            get: {method: 'POST', cache: false, isArray: false}
        });
    }]);

ulboraCmsAdminServices.factory('AddonsList', ['$resource',
    function($resource) {
        return $resource("../rs/addons/list", {}, {
            getList: {method: 'POST', cache: false, isArray: true}
        });
    }]);

ulboraCmsAdminServices.factory('Addons', ['$resource',
    function($resource) {
        return $resource("../rs/addons/:id", {}, {
            get: {method: 'GET', cache: false, isArray: false},
            save: {method: 'POST', cache: false, isArray: false},
            update: {method: 'PUT', cache: false, isArray: false},
            delete: {method: 'DELETE', cache: false, isArray: false}
        });
    }]);