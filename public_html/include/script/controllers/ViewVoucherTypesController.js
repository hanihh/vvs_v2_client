/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('ViewVoucherTypesController', ['$scope', 'DataProviderService', 'SharedPropertiesService', function ($scope, DataProviderService, SharedPropertiesService) {                              
        
             $scope.TriggerViewVoucherTypesState = function () {
                var grid = new Datatable();
                grid.init({
                    "src": $("#datatable_ajax"),
                    // loadingMessage: 'Loading...',
                    dataTable: {
                        "pageLength": 10, // default record count per page
                        "ajax": DataProviderService.getVoucherTypesURL(),
                        "sAjaxDataProp": "data.voucherType",
                        "columns": [
                            {"data": "id"},
                            {"data": "name"},
                            {"data": "english_text"},
                            {"data": "arabic_text"},
                            {"data": "program.name"},
                            {
                                "render": function (data, type, full) {
                                    return '<button style="width:140px" type="button" class="btn yellow printVouchersBySubdistribution"  url="' + DataProviderService.getPrintVoucherURL("", full.id) + '"><i class="fa fa-pencil-square-o"></i> Edit</button>';
                                }
                            }
    //                        {"data": "vendorMobiles[0].vendor_id"},
    //                        {"data": "vendorMobiles[0].distribution_id"}                                         
                        ]
                    },
                });         
            }
            $scope.TriggerViewVoucherTypesState();
    }]);


    