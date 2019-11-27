var value = "value1";

function printFunc() {
    var value = "value2";

    function printValue() {
        return value;
    }

    console.log(printValue());

}

printFunc();