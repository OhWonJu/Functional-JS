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
