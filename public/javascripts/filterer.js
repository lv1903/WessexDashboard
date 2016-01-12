//var MasterFilter = function(){
//
//    this.filter = {};
//
//
//
//};
//
//MasterFilter.prototype.add = function(key, property){
//
//
//
//    this.filter[key] = property
//};
//
//MasterFilter.prototype.remove = function(key, property){
//    if(this.filter.hasOwnProperty(key)){
//        this.filter[key] = ""
//    }
//};
//
//
//
///*--------------------------*/
//
//var Filterer = function(config){
//
//    this.host = "http://q.nqminds.com/";
//    this.db = "v1/datasets/41WGoeXhQg/";
//
//
//    console.log(config.key)
//
//    this.id = config.id;
//    this.key = config.key;
//    this.property_current = config.property_current;
//    this.property_array = undefined;
//
//
//    masterFilter.add(this.key, this.property_current)
//
//
//    //this.bindEvents();
//
//};
//
////Filterer.prototype.bindEvents = function(){
////
////};
//
////Filterer.prototype.update_property = function(current_property){
////    if(current_property != null){
////        this.current_property = current_property;
////    }
////    //ee.emit()
////
////};
//
//
//
//
//Filterer.prototype.list = function(){
//
//    var self = this;
//    var filter_string = "";
//    for(var i in masterFilter.filter){
//
//        if(i != this.key) {
//
//            filter_string += '"' + encodeURIComponent(i) + '":"' + encodeURIComponent(masterFilter.filter[i]) + '",'
//        }
//    }
//    filter_string = filter_string.slice(0, -1);
//
//    var api_query = this.host + this.db + "/distinct?"
//                    + "key=" + encodeURIComponent(this.key)
//                    + "&filter={" + filter_string + "}";
//
//
//    console.log(api_query)
//
//
//
//    $.ajax(api_query).done(function (res) {
//        self.property_array = res.data;
//        self.update_select_box();
//
//    });
//
//
//
//};
//
//Filterer.prototype.update_select_box = function(){
//
//    var self = this;
//
//    console.log(self.id)
//    var select = document.getElementById(self.id);
//
//    var length = select.options.length;
//    var i
//
//    for (i = 0; i < length; i++) {
//        select.options[i] = null;
//    }
//
//    for (i in self.property_array ) {
//
//        var opt = document.createElement('option');
//        opt.value = self.property_array[i];
//        opt.innerHTML = self.property_array[i];
//        select.appendChild(opt);
//
//    }
//
//}