// 함수형 자바스크립트의 실용성 //

log("회원 목록 중 여러 명 찾기");

let users = [
  { id: 1, name: "ID", age: 32 },
  { id: 2, name: "HA", age: 25 },
  { id: 3, name: "BJ", age: 32 },
  { id: 4, name: "PJ", age: 28 },
  { id: 5, name: "JE", age: 27 },
  { id: 6, name: "JM", age: 32 },
  { id: 7, name: "HI", age: 24 },
];

// 정통적인 명령형 필터링 과정
var temp_users = [];
for (let i = 0, len = users.length; i < len; i++) {
  if (users[i].age < 30) temp_users.push(users[i]);
}
log(temp_users);

var ages = [];
for (let i = 0, len = temp_users.length; i < len; i++) {
  ages.push(temp_users[i].age);
}
log(ages);

var temp_users = []; // const, let은 재선언을 허용 x, var를 사용하자..
for (let i = 0, len = users.length; i < len; i++) {
  if (users[i].age >= 30) temp_users.push(users[i]);
}
log(temp_users);

var names = [];
for (let i = 0, len = temp_users.length; i < len; i++) {
  names.push(temp_users[i].name);
}
log(names);

log("\n------------------------------------------------");
log("반복적인 for문을 피하기 위해 filter함수를 구현하자.");
// iterable 자료형과ㅡ 필터링조건 함수가 인자로 주어지는 함수
const filter = (iter, predicate) => {
  const new_list = [];
  for (let i = 0, len = iter.length; i < len; i++) {
    // filter 함수는 predicate 함수 내부의 동작을 전혀 모른다.
    if (predicate(iter[i])) new_list.push(iter[i]); // 결과에만 의존한다. (부가결과 방지?)
  }
  return new_list;
};

var users_under_30 = filter(users, function (user) {
  return user.age < 30;
});
log(users_under_30);

var ages = [];
for (let i = 0, len = users_under_30.length; i < len; i++) {
  ages.push(users_under_30[i].age);
}
log(ages);

var users_over_30 = filter(users, function (user) {
  return user.age >= 30;
});
log(users_over_30);

var names = [];
for (let i = 0, len = users_over_30.length; i < len; i++) {
  names.push(users_over_30[i].name);
}
log(names);

log("코드의 길이를 줄였다 => 재사용성을 높였다.");
// FP는 *항상 동일하게 동작하는 함수*를 만드는게 중요함
// filter는 같은 인자에 대해서는 항상 동일하게 동작함.
// 항상 동일하게 동작하는 함수(filter)와 이를 돕는 보조함수(predicate)를 조합하는 식으로
// 로직을 완성하는 것이 FP의 기본 이념

// 객체간의 상태가 아닌, 넘겨받은 인자에만 의존한다.
// 메소드를 통해 객체의 상태를 변경하고 이러한 객체간의 통신이 OOP의 지향점이라면
// FP의 지향점은 function간의 인자 전달 외에, func의 동작에 있어서
// "부수 효과"를 최소화하는 것이라 볼 수 있다.

// FP도 결국 객체를 인자로 받게 되어있다. (OOP와 완전한 대척점이 아니란 의미)
// OOP와 FP의 차이점은 객체를 확장하느냐(OOP) 객체를 다루는 Func를 확장하느냐(FP)라 볼 수 있다.
// == 추상화의 단위가 객체인지, 함수인지에 대한 차이

log("\n--------------------------------------------");
log("또 다른 for문을 줄이기 위해 map함수를 구현하자.");
// 리펙토링의 핵심 -> 중복 제거
// filter 함수와 마찬가지로
// map의 로직은 철저하게 영향을 주지도, 받지도 않는다.
const map = (list, iteratee) => {
  const new_list = [];
  for (let i = 0, len = list.length; i < len; i++) {
    // 익명함수로 주어지는 iteratee는 주어진 인자를 반환할지 말지만 결정하지
    // 다른 함수에 영향을 주지 않는다.
    new_list.push(iteratee(list[i]));
  }
  return new_list;
};

var users_under_30 = filter(users, function (user) {
  return user.age < 30;
});
log(users_under_30);

var ages = map(users_under_30, function (user) {
  return user.age;
});
log(ages);

var users_over_30 = filter(users, function (user) {
  return user.age >= 30;
});
log(users_over_30);

var names = map(users_over_30, function (user) {
  return user.name;
});
log(names);

log("\n---------------------------------------");
log("실행 결과로 바로 실행하기.->함수 결합하기.");
// filter의 결과 -> iterable
// 이를 곧장 map에 적용가능하다.
var ages_under_30 = map(
  filter(users, function (user) {
    return user.age < 30;
  }),
  function (user) {
    return user.age;
  }
);
log(ages_under_30);

var names_over_30 = map(
  filter(users, function (user) {
    return user.age >= 30;
  }),
  function (user) {
    return user.name;
  }
);
log(names_over_30);

// 로그 조차 결합
function log_length(value) {
  log(value.length);
  return value;
}
log(
  // 결과의 길이에 대한 log를 출력하고
  // 결과를 반환
  log_length(
    map(
      filter(users, user => user.age >= 30),
      function (user) {
        return user.name;
      }
    )
  )
  // return된 결과를 출력하게 됨
);

log("\n-----------------------------------");
log("일급함수 조합을 통헤 실용성 향상시키기.");
// bind value
function bValue(key) {
  // 클로저...
  return function (obj) {
    return obj[key];
  };
}

log(
  log_length(
    map(
      filter(users, user => user.age >= 30),
      bValue("name") // -> function(obj) { return obj["name"] }
    )
  )
);

log("\n---------------------------------------");
log("FP의 뚜렷하게 보이는 방향성-for, if를 최대한 줄여나가는것");
