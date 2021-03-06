/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.getScript("include/ViewModels/Base.js", function () {
});

var Community = Base.extend({

    init: function() {
        this.id = null;
        this.code = "";   
        this.en_name = "";
        this.ar_name = "";
        this.subdistrict_id = 0;
        //this.beneficiaries = [];       
        //this.subdistributions = [];
    },
    
     parse: function(data){
            var community = new Community();
            
            var jsonObj = data;  
            community.id = jsonObj['id'];
            community.en_name = jsonObj['en_name'];
            community.ar_name = jsonObj['ar_name'];
            community.code = jsonObj['code'];
            community.subdistrict_id = jsonObj['subdistrict']['id'];
            /*
            for (x in jsonObj.beneficiaries)
            {
                var beneficiary = new Beneficiary();           
                community.beneficiaries.append(beneficiarie.parse(x));
            }
            
            for (x in jsonObj.subdistributions)
            {
                var subdistribution = new Subdistribution();           
                community.subdistributions.append(subdistribution.parse(x));
            }
            */
            return community;
        },
        
    parseArray: function(array){
        var parsedArray = [];  
        var community = new Community();
                 

        for (i = 0; i < array["length"]; i++) {             
            parsedArray.push(community.parse(array[i]));
        }
        
           
        return parsedArray;
    }
});