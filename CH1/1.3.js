// 함수형 자바스크립트의 실용성 2 //

let users = [
  { id: 1, name: "ID", age: 32 },
  { id: 2, name: "HA", age: 25 },
  { id: 3, name: "BJ", age: 32 },
  { id: 4, name: "PJ", age: 28 },
  { id: 5, name: "JE", age: 27 },
  { id: 6, name: "JM", age: 32 },
  { id: 7, name: "HI", age: 24 },
];

log("회원 목록 중 한 명 찾기.");
// 주어진 iter의 길이 만큼 반복할 수 밖에 없는 구조이다.
// 효율, 중복에서 문제를 겪을 수 있다.
// log(filter(users, user => user.id == 3)[0]);

// for + break를 사용할 수 있지만. FP의 재활용성을 기대할 수 없다.

// findById
// for + break 구조를 함수화 하자.
const findById = (list, id) => {
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i].id == id) return list[i]; // return을 통해 함수를 종료
  }
};
log(findById(users, 3));
log(findById(users, 99));

const findByName = (list, name) => {
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i].name == name) return list[i];
  }
};
log(findByName(users, "BJ"));
log(findByName(users, "JE"));

const findByAge = (list, age) => {
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i].age == age) return list[i];
  }
};
log(findByAge(users, 28));

// 아직까지는 중복적인 구조가 있다. (FP적이지 않음..)

log("\n------------------------------------------");
log("인자를 추가하여 함수의 구조를 더욱 단순화 하기.");
const findBy = (key, list, val) => {
  // key로 value를 얻을 수 있는 객체들의 배열에 대해 대응하는 함수가 되었다.
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i][key] === val) return list[i];
  }
};
log(findBy("name", users, "HI"));

// key가 아닌 메서드를 통해 value를 얻어야 한다면?
// 두 가지 이상의 조건이 필요하다면?
// === 이 아닌 다른 조건이 필요하다면?

log("\n------------");
log("값에서 함수로");
function User(id, name, age) {
  this.getId = function () {
    return id;
  };
  this.getName = function () {
    return name;
  };
  this.getAge = function () {
    return age;
  };
}

var users2 = [
  new User(1, "ID", 32),
  new User(2, "HA", 25),
  new User(3, "BJ", 32),
  new User(4, "PJ", 28),
  new User(5, "JE", 27),
  new User(6, "JM", 32),
  new User(7, "HI", 24),
];

// 인자로 키와 값이 아닌, 함수를 사용해보자.
// 모든 상황에 대응 가능한 find func
const find = (list, predicate) => {
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i])) return list[i];
  }
};
log(
  find(users2, function (u) {
    return u.getAge() < 30;
  })?.getName()
);
log(
  // 이름에 P를 포함하는?
  find(users2, function (u) {
    return u.getName().indexOf("P") != -1 ? u : null;
  }).getName()
);
log(
  // 다중 조건
  find(users2, function (u) {
    return u.getAge() === 32 && u.getName() === "JM";
  })?.getName()
);
// find함수에 들어오는 데이터의 특성은 보조함수(predicate)가 대응해 주기 떄문에
// find함수는 데이터의 특성에서 완전히 분리될 수 있다...!
// --> 다형성과 안전성을 높일 수 있다.

log(
  map(
    filter(users, function (u) {
      return u.age >= 30;
    }),
    function (u) {
      return u.name;
    }
  )
);
log(
  map(
    filter(users2, function (u) {
      return u.getAge() < 30;
    }),
    function (u) {
      return u.getName();
    }
  )
);
// 데이터가 달라져도 map, filter 함수의 동작에는 변함이 없다.
// 보조함수가 해당 데이터를 처리해주면 되기 때문이다.

log("\n----------------------------------------");
log("함수를 만드는 함수와 find, filter 조합하기.");
function bMatch1(key, value) {
  return function (obj) {
    return obj[key] === value;
  };
  // 함수를 리턴하기 때문에 filter나 map과 조합 가능..(predicate, iteratee)
}
log(find(users, bMatch1("id", 1)));
log(find(users, bMatch1("name", "HI")));
log(find(users, bMatch1("age", 27)));

function object(key, value) {
  let obj = {};
  obj[key] = value;
  return obj;
}
// 여러 key에 해당하는 value들을 비굫는 함수
function match(obj, obj2) {
  for (let key in obj2) {
    if (obj[key] !== obj2[key]) return false;
  }
  return true;
}
function bMatch(obj2, value) {
  if (arguments.length == 2) obj2 = object(obj2, value);
  return function (obj) {
    return match(obj, obj2);
  };
}
log(match(find(users, bMatch("id", 3)), find(users, bMatch("name", "BJ"))));
log(find(users, bMatch({ name: "JM", age: 32 })));

log("\n----------------------------------------");
// 값 비교만 하는 Array.prototype.indexOf 보다 활둉도가 높은 findIndex 만들기
function findIndex(list, predicate) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i])) return i;
  }
  return -1;
}
log(findIndex(users, bMatch({ name: "JM", age: 32 })));
log(findIndex(users, bMatch({ age: 36 })));

log("\n------------------");
log("    고차 함수   ");
// map, filter, find, findIndex, bValue, bMatch 같은 함수들을 고차함수라 한다.
// 고차 함수란, 함수를 인자로 받거나 함수를 리턴하는 함수를 말한다.
// 보통 고차 함수는 함수를 인자로 받아 필요할 때 실행하거나, 클로저를 만들어 리턴한다.

const _map = (list, iteratee) => {
  let newList = [];
  for (let i = 0, len = list.length; i < len; i++) {
    newList.push(iteratee(list[i], i, list));
  }
  return newList;
};
const _filter = (list, predicate) => {
  let newList = [];
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i], i, list)) newList.push(list[i]);
  }
  return newList;
};
const _find = (list, predicate) => {
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i], i, list)) return list[i];
  }
};
const _findIndex = (list, predicate) => {
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i], i, list)) return i;
  }
  return -1;
};

log(
  _filter([1, 2, 3, 4], function (val, idx) {
    return idx > 1;
  })
);
log(
  _filter([1, 2, 3, 4], function (val, idx) {
    return idx % 2 == 0;
  })
);

log("\n------------------------");
log("identity(v) 함수의 활용");
// undersocre.js에 있는 _.identity 함수의 활용을 알아본다.
const _identity = v => v;
var a = 10;
log(_identity(a));
// 아무런 역할을 하지 않는 것 처럼 보인다..
// 언제 사용해야하는걸까?
log(_filter([true, 0, 10, "a", false, null], _identity));
// false와 false로 취급되는 값들을 걸러준다?
// const _falsy = v => !v;
// const truthy = v => !!v;

// identity를 다른 고차 함수와 조합하여 유용한 함수들을 만들 수 있다.
var _some = list => !!_find(list, _identity); // !! 가 불리언으로 변환해준다. true로 취급되는 값이 있는지
var _every = list => _filter(list, _identity).length == list.length; // 모두 true 인지
log(_some([0, null, 2]));
log(_some([0, null, false]));
log(_every([0, null, 2]));
log(_every([{}, true, 2]));
log(_every([0, null, -1]));

// _every는 항상 루프를 끝까지 도는 단점이 있다.
const not = v => !v;
const beq = a => b => a === b;
// !과 === 이 있는데 굳이...?

var _some = list => !!_find(list, _identity);
var _every = list => beq(-1)(_findIndex(list, not));
// 부정값을 하나라도 만나면 true가 반환됨 = 루프 중단
// 인덱스 값이 나오니 beq값은 false가 될 것.
log("\n");
log(_some([0, null, 2]));
log(_some([0, null, false]));
log(_every([0, null, 2]));
log(_every([{}, true, 2]));
log(_every([0, null, -1]));

log("\n-----------");
log("함수 쪼개기");
const positive = list => _find(list, _identity);
const negativeIndex = list => findIndex(list, not);
var _some = list => not(not(positive(list)));
var _every = list => beq(-1)(negativeIndex(list));
log(_some([0, null, 2]));
log(_some([0, null, false]));
log(_every([0, null, 2]));
log(_every([{}, true, 2]));
log(_every([0, null, -1]));

log("\n------------");
log("함수 합성하기");
// 함수를 쪼갤수록 함수 합성은 쉬워진다.
// _.compose는 오른쪽 함수의 결과를 바로 왼쪽 함수에게 전달한다.
const _compose = function () {
  // 화살표 함수에는 arguments가 없음.....
  const args = arguments;
  const start = args.length - 1;
  return function () {
    let i = start;
    let result = args[start].apply(this, arguments);
    while (i--) result = args[i].call(this, result);
    return result;
  };
};
var greet = function (name) {
  return "Hi: " + name;
};
var exclaim = function (statement) {
  return statement.toUpperCase() + "!";
};
var welcome = _compose(greet, exclaim);
log(welcome("moe"));

var _some = _compose(not, not, positive); // 맨 오른쪽 함수가 인자를 받아 결과를 왼쯕으로 넘김
// some[...] -> not(not(positive[...])) 인셈..
var _every = _compose(beq(-1), negativeIndex);

log(_some([0, null, 2]));
log(_some([0, null, false]));
log(_every([0, null, 2]));
log(_every([{}, true, 2]));
log(_every([0, null, -1]));

