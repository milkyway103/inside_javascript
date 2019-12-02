var Person = function(arg) {
    var name = arg ? arg : "zzoon";

    this.getName = function() {
        return name;
    }
    this.setName = function(arg) {
        name = arg;
    }
};

var me = new Person();
console.log(me.getName());  // zzoon
me.setName("iamhjoo");
console.log(me.getName());  // iamhjoo
console.log(me.name);   // undefined