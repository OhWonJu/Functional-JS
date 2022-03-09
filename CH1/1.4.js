// 함수형 JS를 위한 기초 //

// FP..함수를 잘 다뤄야겠지. 함수와 관련된 개념들과 기능을 알아본다.
// 일급함수, 고차함수, 클로저, 콜백 패턴, 부분 적용, arguments객체 핸들링, function obj의 method(bind, call, aplly 등)

log("\n--------");
log("일급 함수");
// JS에서 func는 일급 객체이자 일급 함수.
// JS Obj은 일급 객체
// 일급이 뭔데... 값으로 다룰 수 있음을 의미함.

// 일급으로서의 조건
// 1. 변수에 담을 수 있다
// 2. 함수나 메서드의 인자로 넘길 수 있다
// 3. 함수나 메서드에서 리탄할 수 있다.

// JS에서 모든 값은 일급이다... 모두 object.prototype 요런식으로 객체로부터 파생되어 나온거니까..!

// 일급 함수가 되기 위해서는 추가 조건들이 있다.
// 1. 아무 때나 선언이 가능하다. (런타임시에도!!)
// 2. 익명으로 선언할 수 있다.
// 3. 익명으로 선언한 함수도 함수나 메서드의 인자로 넘길 수 있다.
// JS의 함수는 이러한 조건들을 모두 만족한다.

function f1() {}
// 함수를 값으로 다룰 수 있는지?
var a = typeof f1 === "function" ? f1 : function () {}; // 함수가 값으로서 삼항 연산자에 대응된다..
log(a);
// 일급으로서의 조건.. 함수나 메서드에서 반환 가능한가?
function f2() {
  return function () {}; // yes!
}
// 익명 선언,
log(
  (function (a, b) {
    return a + b;
  })(10, 5)
);
// 익명으로서 인자로 넘겨짐
function callAndAdd(a, b) {
  return a() + b();
}
log(
  callAndAdd(
    function () {
      return 10;
    },
    function () {
      return 5;
    }
  )
);

log("\n---------");
log(" 클로저 ");
// 스코프 레인지 밖의 값을 참조할 수 있는 테크닊..
// 클로저는 자신이 생성될 떄의 환경을 기억하는 함수이다. -> 아웃오브레인지라도 기억하고 있는 것..!
// == 클로저는 자신이 생성될 떄의 스코프에서 알 수 있었던 변수를 기억하는 함수이다.

// 이런 클로저의 특성을 활용하는 함수를 클로저라 불러주자.. 기본적으로 모든 func가 생성될 때의 환경을 기억하고 있으니까..

// 의미적으로나 실제적으로 진짜 클로저가 되기 위한 조건
// 1. 정의된 함수 내부의 변수중 해당 함수 내에 선안되지 않은 변수가 있어야한다.. 기억된 환경에서 가져오는것.
// 2. 해당 변수는 함수가 정의된 스코프에 존재하던가, 그 스코프가 알 수 있는 상태여야한다.
function parent() {
  var a = 5;
  function myFn() {
    console.log(a);
  }
}
function parent2() {
  var a = 5;
  function parent1() {
    function myFn() {
      // 자신이 생성될 때 상위 스코프의 "환경"을 기억한다.
      console.log(a);
    }
    myFn();
  }
  parent1();
}
// V8 환경 외에서 클로저를 쓰려면 .. 클로저를 외부로 리턴하여 지속적으로 참조해야 클로저가 참조하고있는 외부 스코프의 "값"이 가비지컬렉팅을 안당한다..

// 정리하자면.. 클로저는 자신이 생성될 때의 스코프에서 알 수 있었던 변수 중 언젠가 자신이 실행될 때 사용할 변수들을 기억하여 유지시키는 함수이다.

var a = 10;
var b = 20;
function f1() {
  // f1은 클로저가 아님
  return a + b;
  // 글로벌 스코프의 모든 변수는 클로저가 유지시키는지 안시키는지와 상관 없이 유지되기 때문!
}

function f2() {
  var a = 10;
  var b = 20;
  function f3(c, d) {
    // 클로저가 아님
    return c + d;
    // c, d는 f3 지역 변수이니까.
  }
  return f3;
}
// var f4 = f2();

function f4() {
  var a = 10;
  var b = 20;
  function f5() {
    return a + b;
  }
  return f5(); // 클로저가 있었다가 없어진 경우
  // f5가 실행되기전까지 a, b는 유지되었지만
  // f5가 실행 종료되고 나면...a, b도 결국 가비지행
  // 함수가 어디 변수에 담기면 클로저가 되겠지.
}
log(f4());

function f6() {
  var a = 10;
  function f7(b) {
    return a + b;
  }
  return f7;
}
var f8 = f6(); // f7(b) // 이 때 분명 f6은 호출되고 끝났음. a는 뒤져야함
log(f8(20)); // a의 값이 유지되고 있음을 알 수 있다.
log(f8(10)); // f7은 진정한 클로저가 되었다.

function f9() {
  var a = 10;
  var f10 = function (c) {
    return a + b + c;
  };
  var b = 20;
  return f10; // 클로저는 자신이 생성될때의 환경을 기억함. (정의 x)
  // 호이스팅과도 연관이 있다.. (끌어올리는거..)
}
var f11 = f9();
log(f11(30));

// 클로저가 변수를 유지시키고 있기 때문에 변수의 값은 충분히 바뀔 수 있다..

// 때가 조금 길다?
// 때란 함수가 생성되는 라인, 그 이전을 의미하는 것이 아니라
// 함수가 실행된 그 스코프의 컨텍스트 전체를 의미하는 것
// 비동기 처리가 있다면 그 "때"는 더 길어지게 된다.

// 스코프에서 알 수 있었던?
// 스코프 자체가 함수라면?
// 그 함수가 여러번 호출 된다면?
// 클로저가 생서되고 있는 이번 실행 컨텍스트에서 알 수 있었던을 의미하는 것이다.

log("\n-----------------");
log("클로저의 실용 사례");
// 클로저가 강력하고, 실용적인 순간
// 1. 이전 상황을 나중에 일어날 상황과 이어 나갈 때
// 2. 함수로 함수를 만들거나 부분 적용을 할 때
const userList = document.createElement("div");
userList.className = "user-list";

document.body.appendChild(userList);

let users = [
  { id: 1, name: "HA", age: 25 },
  { id: 2, name: "PJ", age: 28 },
  { id: 3, name: "JE", age: 27 },
];

$(".user-list").append(
  _.map(users, function (user) {
    var button = $("<button>").text(user.name);
    button.click(() => {
      if (confirm(user.name + "님을 팔로잉 하시겠습니까?")) follow(user); // 클릭할 때 마다 이전 상태, user 정보를 이어나간다.
    });
    return button; // button을 통해 user 정보를 기억하는 클로저 follow가 생김
  })
);

function follow(user) {
  alert("이제 " + user.name + "님의 소식을 보실 수 있습니다.");
} // 클로저였다가 사라지는 ...

log("\n---------");
log("고차 함수");
// 고차 함수?
// 다시 정리하자면 고차 함수란 함수를 다루는 함수를 말한다!
// 1. 함수를 인자로 받아 대신 실행하는 함수
// 2. 함수를 리턴하는 함수
// 3. 함수를 인자로 받아 또 다른 함수를 리턴하는 함수

// applicative function (1)
// 함수를 인자로 받아 내부에서 실행하면서, 받아 둔 함수에 자신이 알고 있는 값을
// 인자로 전달하는 형태
// map, filter, reduce와 같은것... //

// 함수를 리턴하는 함수 (2)
function constant(val) {
  return function () {
    return val;
  };
}

var always10 = constant(10);
log(always10());
log(always10());
log(always10());
// 클로저를 이용해 인자로 받은 값을 기억해둔다.. 많이 사용되는 패턴이라 한다.
// 무슨 의미가 있을까...? 그저 상수형일뿐이디/

// 함수를 인자로 받고 함수를 리턴하는(3)
function add(val1, val2) {
  return val1 + val2;
}
function mod(val1, val2) {
  return val1 / val2;
}

function callWith(val1) {
  // val1을 기억하는 클로저를 생성해서 리턴
  return function (val2, func) {
    // 함수를 대신 실행해주고, 함수를 반환?
    return func(val1, val2);
  };
}

var callWith10 = callWith(10);
log(callWith10(20, add));
log(callWith(30)(20, mod));

// callWith을 분리했기에 다른 타입의 데이터도 사용 가능..
log(
  callWith([1, 2, 3])(function (v) {
    return v * 10;
  }, _.map)
);
// map([1,2,3], iteratee)

_.get = function (list, idx) {
  return list[idx];
};

var callWithUsers = callWith([
  { id: 2, name: "HA", age: 25 },
  { id: 4, name: "PJ", age: 28 },
  { id: 5, name: "JE", age: 27 },
]);
log(callWithUsers(2, _.get));
log(
  callWithUsers(function (user) {
    return user.age > 25;
  }, _.find)
);
log(
  callWithUsers(function (user) {
    return user.age > 25;
  }, _.filter)
);
log(
  callWithUsers(function (user) {
    return user.age > 25;
  }, _.some)
);
log(
  callWithUsers(function (user) {
    return user.age > 25;
  }, _.every)
);

// 매끄니피쏀트!!!