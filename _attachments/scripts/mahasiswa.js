'use strict';
angular.module('mahaSiswa', []);

angular.module('mahaSiswa')
.service("mahasiswaRepository", ['$http', function ($http) {
    this.createItem = function (data) {
        var req = {
            method: 'PUT',
            url: '/mahasiswaapp/' + data._id,
            data: data,
        };
        return $http(req);
    }

    this.getAllItems = function () {
        var req = {
            method: 'GET',
            url: '/mahasiswaapp/_design/mahasiswaapp/_view/show_all'
        };
        return $http(req);
    }

    this.deleteItem = function (data) {
        var req = {
            method: 'DELETE',
            url: '/mahasiswaapp/' + data._id + '?rev=' + data._rev
        };
        return $http(req);
    }
}]);

angular.module('mahaSiswa')
  .controller('mahasiswaController', ["mahasiswaRepository","$filter", function (mahasiswaRepository,$filter) {
      var ctr = this;
      this.serverError = "";

      function refreshData() {
          mahasiswaRepository.getAllItems().success(function (d) {
              ctr.mahasiswaItems = d.rows.map(function (o) { return o.value; })
          });
          ctr.currentItem = {};
      }

      refreshData();

      this.saveItem = function () {
          if (!this.currentItem.nim) return;

          if (!this.currentItem._id) {
              this.currentItem._id = "client1" + ((new Date()).getTime()).toString();
              mahasiswaRepository.createItem(this.currentItem)
                  .success(function () { refreshData(); })
                    .error(function () { ctr.serverError = "Unable to save." });
              this.currentItem = {};
          }
          else {
              mahasiswaRepository.createItem(this.currentItem)
                  .success(function () { refreshData(); })
                    .error(function () { ctr.serverError = "Unable to save." });
          }
      }

      this.deleteItem = function (index) {
          mahasiswaRepository.deleteItem(this.mahasiswaItems[index])
                  .success(function () { refreshData(); })
                    .error(function () { ctr.serverError = "Unable to delete." });
      }

      this.createNew = function () {
          this.currentItem = {};
      }

      this.setSelectedItem = function (i) {        
          this.currentItem = angular.copy(this.mahasiswaItems[i]);
          this.currentItem.date = $filter('date')(this.currentItem.date,"yyyy-MM-dd");
      }
  }]);