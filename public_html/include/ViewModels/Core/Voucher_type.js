/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.getScript("include/ViewModels/Base.js", function () {
});


var Voucher_type = Base.extend({

    init: function() {
        this.id = null;
        this.name = "";
        this.arabic_text = "";
        this.english_text = "";
        this.program = "";
    },
    
     parse: function(data){
            var voucher_type = new Voucher_type();
             var jsonObj = data;
             
            voucher_type.id = jsonObj['id'];
            voucher_type.name = jsonObj['name'];      
            voucher_type.arabic_text = jsonObj['arabic_text'];
            voucher_type.english_text = jsonObj['english_text'];
            voucher_type.program = jsonObj['program'];
           
            return voucher_type;
        },
        
    parseArray: function(array){
        var parsedArray = [];  
        var voucher_type = new Voucher_type();
                 
       if (array)          
        for (i = 0; i < array["length"]; i++) {             
            parsedArray.push(voucher_type.parse(array[i]));
        }
        else
            console.log("Voucher type data is empty!")
           
        return parsedArray;
    }
});