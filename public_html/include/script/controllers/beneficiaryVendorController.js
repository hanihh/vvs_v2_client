/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


app.controller('beneficiaryVendorController', ['$scope', '$stateParams', '$state','DataProviderService', 'SharedPropertiesService', function ($scope, $stateParams,$state, DataProviderService, SharedPropertiesService) {
        $scope.contentTitle.title = "Beneficiaries";
        
        var checkedBenesIds = [];
        var addedBenesIds = [];
        var canceledBenesIds = [];

        $scope.chooseCheckBoxItems = {};
        $scope.beneficiary = {};
        $scope.filter = {};

        var vendor_id = ($stateParams) ? $stateParams.vendor_id : null;;
        //$scope.subdistributionId = SharedPropertiesService.getSubdistributionIdForBeneficiary();        

        $.getScript('include/ViewModels/Beneficiary/Beneficiary.js', function ()
        {
            // *** Build Tree by existing distribution id ***
             var dist_id = ($stateParams) ? $stateParams.dist_id : null;
                            if (dist_id && SharedPropertiesService.getIsDistributionsView() === false && (SharedPropertiesService.getTreeBuildStatus() === false ||
                                    dist_id !== SharedPropertiesService.getDistributionId())) {       
                SharedPropertiesService.getTree().BuildTreeWithDistributionIdByQueryString(dist_id);
            }
 
            $("#tagsChosen").tagsInput({
                'height': '100px',
                'width': '100%',
                'interactive': false,
                'onRemoveTag': function (data) {
                    var checkboxObj = $('#' + data);
                    // Do not work here because the datatable control is depending on class called "Checked" to check the checkox
                    //checkboxObj.attr('checked', false);
                    checkboxObj.parent("span").removeClass("checked");
                    var checkboxObj_idvalue = checkboxObj.attr('idvalue');
                     checkedBenesIds = RemoveFromArray(checkedBenesIds, checkboxObj_idvalue);
                    if ($.inArray(checkboxObj_idvalue, canceledBenesIds) == -1 && $.inArray(checkboxObj_idvalue, addedBenesIds) > -1)
                        canceledBenesIds.push(checkboxObj_idvalue);
                },
            });

            $('.date-picker').datepicker({
                rtl: Metronic.isRTL(),
                autoclose: true
            });

            var grid = new Datatable();
            grid.init({
                "src": $("#datatable_ajax"),
                // loadingMessage: 'Loading...',

                dataTable: {
                    "pageLength": 10, // default record count per page
                    "ajax": DataProviderService.getBeneficiariesByDistributionIdURL(dist_id, true, false, true),
                    "sAjaxDataProp": "Beneficiaries",
                    "columns": [
                        {"data": "id",
                            "render": function (data, type, full) {
                                console.log(full);
                                var checkedAttr = "";
                                if (full.vendor > 0 && vendor_id == full.vendor)
                                {
                                    checkedAttr = 'checked';
                                    if ($.inArray(full.id, checkedBenesIds) == -1) {
                                        checkedBenesIds.push(full.id);
                                        addedBenesIds.push(full.id);
                                        $('#tagsChosen').addTag(full.registration_code);
                                    }

                                } else if (full.vendor > 0 && vendor_id != full.vendor){
                                    checkedAttr = 'checked disabled';
                                }else {
                                     checkedAttr = '';
                                }
                                return "<input type='checkbox' class='ChooseCheckBox' id=" + full.registration_code + " idValue = " + full.id + " " + checkedAttr + " >";
                            }
                        },
                        {"data": "registration_code"},
                        {"data": "en_name"},
                        {"data": "father_name"},
                        {"data": "birth_year"},
                        {"render": function (data, type, full) {
                                return "";
                            }}
                    ]
                },
            });
            
            $scope.chooseCheckBoxItems = $(".ChooseCheckBox");
            $scope.chooseCheckBoxItems.die( "click" );
            $scope.chooseCheckBoxItems.live("click", function () {
                if ($(this).is(':checked'))
                {
                    $('#tagsChosen').addTag($(this).attr("id"));

                    var idvalue = $(this).attr("idvalue");
                    if ($.inArray(idvalue, canceledBenesIds) != -1) {
                         checkedBenesIds = RemoveFromArray(checkedBenesIds, idvalue);
                    }
                    checkedBenesIds.push($(this).attr("idvalue"));
                } else {
                    $('#tagsChosen').removeTag($(this).attr("id"));
//
//                    var idvalue = $(this).attr("idvalue");
//                    if ($.inArray(idvalue, addedBenesIds) != -1) {
//                        canceledBenesIds.push(idvalue);
//                    }
//                    checkedBenesIds.pop($(this).attr("idvalue"));
                }
            });
            //});
        });

        $scope.debug = function () {
            console.log(checkedBenesIds);
            console.log(addedBenesIds);
            console.log(canceledBenesIds);
        }


        $scope.Save = function () {
            var updateObject = $.param({distribution_id: dist_id,
                vendor_id: vendor_id,
                beneficiaries: checkedBenesIds
                });
            
            DataProviderService.updateVoucherVendor(updateObject).success(function (data) {
                if (canceledBenesIds.length != 0) {
                    var cancelObject = $.param({distribution_id: dist_id, subdistribution_id: "", vendor_id: vendor_id,
                        beneficiaries: canceledBenesIds,
                        removevendor: "1"});
                    DataProviderService.RemoveVoucherVendor(cancelObject).success(function (data) {
                         toastr.success('Vendor beneficiaries have been deleted successfully!');
                    });
                }
 
                    toastr.success('Vendor beneficiaries have been added successfully!');
            });
        }

         $scope.Reset = function(){         
                        $state.transitionTo($state.current, angular.copy($stateParams), { reload: true, inherit: true, notify: true });
                        toastr.warning('Form has been reset!');                       
                    }
                    
        $scope.Filter = function (filter) {
            console.log(filter);
            /*
             DataProviderService.getBeneficiaries(filter).success(function (data) {
             var data = data["data"]["beneficiary"];
             
             var beneficiary = new Beneficiary();
             $scope.beneficiaries = beneficiary.parseArray(data);
             });
             */
        }
    }]);

function BulidTable(data) {
    var records = [];

    for (i = 0; i < data.length; i++) {
        var rowData = data[i];
        var rowRecord = [
            '<input type="checkbox" class="ChooseCheckBox" name="' + rowData['id'] + '" value="' + rowData['registration_code'] + '"valueName="' + rowData['registration_code'] + '">',
            rowData.registration_code,
            rowData.en_name,
            rowData.father_name,
            rowData.birth_year,
            ''
        ];
        records.push(rowRecord);
    }
    return records;
}