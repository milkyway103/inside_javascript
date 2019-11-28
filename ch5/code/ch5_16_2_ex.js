function countSeconds(howMany) {
    for (var i = 1; i <= howMany; i++) {
        (function (currentI) {
            setTimeout(function () {
                console.log(currentI);
            }, currentIi*1000);
        }(i));
    }
};

countSeconds(3);