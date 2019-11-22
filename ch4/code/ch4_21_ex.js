function func(arg1, arg2) {
    console.log(arg1, arg2);
}

func();                     // (출력값) undefined undefined
func(1);                // (출력값) 1 undefined
func(1, 2);         // (출력값) 1 2
func(1, 2, 3);      // (출력값) 1 2