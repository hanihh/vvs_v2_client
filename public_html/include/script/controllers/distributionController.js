/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('DistributionController', ['$scope', '$stateParams', '$state', '$location', 'DataProviderService', 'SharedPropertiesService', function ($scope, $stateParams, $state,$location, DataProviderService, SharedPropertiesService) {

        $.getScript('include/ViewModels/Core/Distribution.js', function () {
            $.getScript('include/ViewModels/Core/Program.js', function () {
                $.getScript('include/ViewModels/Core/Donor.js', function () {                                                             
                    $scope.distribution = new Distribution();
                    $scope.distributionNameProgramPart = "";
                    $scope.distributionDatePart = "";
                    $('#defaultrange').daterangepicker({
                        opens: (Metronic.isRTL() ? 'left' : 'right'),
                        format: 'YYYY-MM-DD',
                        separator: ' to ',
                        startDate: moment(),
                        endDate: moment().add('days', 1),
                        minDate: moment().add('days', -1),
                    },
                            function (start, end) {
                                $scope.distribution.start_date = start.format('YYYY-MM-DD');
                                console.log($scope.distribution.start_date);
                                $scope.distribution.end_date = end.format('YYYY-MM-DD');
                                $('#defaultrange input').val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
                                var datetime = start.format('YYYY-MM-DD');
                                var dateParts = datetime.split("-");
                                $scope.distributionDatePart = dateParts[1] + "-" + dateParts[2];
                                $scope.distribution.name = $scope.distributionNameProgramPart + "-" + $scope.distributionDatePart;
                                $("#distribution_name").val($scope.distribution.name);
                                //var distributionNameParts = distributionName.split("-");

                            }
                    );
                    /*
                     $('#defaultrange').on('apply.daterangepicker', function (ev, picker) {
                     $scope.distribution.start_date = picker.startDate.format('YYYY-MM-DD');
                     $scope.distribution.end_date = picker.endDate.format('YYYY-MM-DD');
                     });
                     */


                    //Programs
                    DataProviderService.getPrograms().success(function (data) {
                        var data = data["data"]["program"];
                        var program = new Program();
                        $scope.programItems = program.parseArray(data);
                    });

                    //Donors            
                    DataProviderService.getDonors().success(function (data) {
                        var data = data["data"]["donor"];
                        var donor = new Donor();
                        $scope.donorItems = donor.parseArray(data);
                    });

                    $scope.$watch('distribution.online', function (newVal, oldVal) {
                        if (newVal != oldVal)
                            if (newVal == 1)
                                $('#online-switch').bootstrapSwitch('state', true);
                            else if (newVal == 0)
                                $('#online-switch').bootstrapSwitch('state', false);
                    });

                    $scope.$watch('distribution.program_id', function (newVal, oldVal) {
                        if (newVal != oldVal) {
                            if (newVal != null) {
                                if ($scope.programItems != null) {
                                    $scope.programItems.forEach(function (entry) {
                                        if (entry.id == newVal)
                                            $scope.distributionNameProgramPart = entry.code;
                                        $scope.distribution.name = $scope.distributionNameProgramPart + "-" + $scope.distributionDatePart;
                                    });
                                } else {

                                }
                            }
                        }
                    });

                    $scope.$watch('distribution.start_date', function (newVal, oldVal) {
                        if (newVal != oldVal) {

                        }
                    });


                    var id = ($stateParams) ? $stateParams.dist_id : null;
                    if (id) {
                        DataProviderService.getDistributions(id).success(function (data) {
                            var data = data["data"]["distribution"];
                            var distribution = new Distribution();
                            $scope.distribution = distribution.parse(data);
                            if (new Date($scope.distribution.start_date).getTime() <= new Date().getTime()) {
                                //$('button').attr("disabled='disabled'");
                                //$('#s2id_donorList > a > span:first').disableSelection();
                                //alert(1);
                            }
                            //alert(id);
                            $scope.contentTitle.title = "Distribution: " + $scope.distribution.name;

                            $('#s2id_programList > a > span:first').html(data.program.name);
                            $('#s2id_donorList > a > span:first').html(data.donor.name);

                            // *** Checking dates and filling Date Range Control ***
                            var startDate = new Date($scope.distribution.start_date);
                            var endDate = new Date($scope.distribution.end_date);

                            var startDateString = "";
                            var endDateString = "";
                            if (dates.check(startDate)) {
                                $('#defaultrange').data('daterangepicker').setStartDate(startDate);
                                startDateString = startDate.toDateString();
                            }
                            if (dates.check(endDate)) {
                                $('#defaultrange').data('daterangepicker').setEndDate(endDate);
                                endDateString = endDate.toDateString();
                            }

                            var dateParts = $scope.distribution.start_date.split(" ");
                            dateParts = dateParts[0].split("-");
                            $scope.distributionDatePart = dateParts[1] + "-" + dateParts[2];
                            $scope.dateRange = startDateString + (startDateString == "" && endDateString == "" ? "" : " - ") + endDateString;
                            // ******************************************************
                            if ($scope.programItems != null) {
                                $scope.programItems.forEach(function (entry) {
                                    if (entry.id == $scope.distribution.program_id)
                                        $scope.distributionNameProgramPart = entry.code;
                                });
                            }

                            // *** Build Tree by existing distribution id ***
                            var dist_id = ($stateParams) ? $stateParams.dist_id : null;
                            if (dist_id && SharedPropertiesService.getIsDistributionsView() === false && (SharedPropertiesService.getTreeBuildStatus() === false ||
                                    dist_id !== SharedPropertiesService.getDistributionId())) {
                                SharedPropertiesService.getTree().BuildTreeWithDistributionIdByQueryString(id);
                            }
                            // **********************************************     



                            $scope.printVouchers = function () {
                                    var id = ($stateParams) ? $stateParams.dist_id : null;
                                    var win = window.open(DataProviderService.getPrintVoucherURL(id, ""), '_blank');
                                    win.focus();
                            };
                            $scope.printDistributionReport = function () {
                                //alert(new Date(SharedPropertiesService.getDistributionEndDate()).getDate());
//                                if (new Date(SharedPropertiesService.getDistributionEndDate()).getDate() >= new Date().getDate())
//                                    toastr.error('You can\'t print the distribution report unless the distribution is over.');
//                                else {
                                    var win = window.open(DataProviderService.getDistributionReport(dist_id, ""), '_blank');
                                    win.focus();
//                                }
                            };
                        });
                    }else{
                          SharedPropertiesService.getTree().AddNewDistributionNode();
                          $scope.contentTitle.title = "Add New Distribution";
                    }


                    $scope.Save = function (distribution) {
                        console.log($('#online-switch').bootstrapSwitch("state"));
                        distribution.online = $('#online-switch').bootstrapSwitch("state") == true ? 1 : 0;
                        if (distribution.id == null) {
                            DataProviderService.createDistribution(distribution).success(function (data) {
                                var id = data["data"]["distribution"]["id"];
                                SharedPropertiesService.getTree().BuildTreeWithDistributionIdByQueryString(id);
                                $location.path($location.path() + id);
                                toastr.success('Distribution has been added successfully!');
                            });
                        } else {
                            if (new Date(distribution.start_date).getTime() <= new Date().getTime())
                                toastr.error('Error! can\'t modify this distribution it\'s already started');
                            else {
                                DataProviderService.updateDistribution(distribution).success(function (data) {
                                    var id = data["data"]["distribution"]["id"];
                                    SharedPropertiesService.getTree().BuildTreeWithDistributionIdByQueryString(id);
                                    toastr.success('Distribution has been updated successfully!');
                                });
                            }
                        }
                    }

                    $scope.Reset = function () {
                        $state.transitionTo($state.current, angular.copy($stateParams), {reload: true, inherit: true, notify: true});
                        toastr.warning('Form has been reset!');
                    }
                });
            });
        });
    }]);

