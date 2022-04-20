// underscore.js 간단히 써보기 //

var eq5 = function (a) {
  return a === 5;
};
log(eq5(5));
var neq5 = _.negate(eq5);
log(neq5(5));
//  negate는 그냥 값을 반대로 바꾸는 함수?
// nop, 받아 둔 함수를 실행하여 나온 결과를 반대로 바꾸는 함수를!! 리턴하는 함수.
_.negate = function (func) {
  return function () {
    return !func.apply(this.arguments);
  };
};

_.noop();
log(_.noop());
_.noop = function () {};
// _.noop은 무엇을 인자로 받던 undifined를 반환한다.
// 왜 필요한걸까...? -> p.138

// underscore.js를 체이닝 하는 방법 //
// 일반적인 functional
log(
  _.filter(
    _.map([1, 2, 3], function (n) {
      return n * 2;
    }),
    function (n) {
      return n <= 4;
    }
  )
);
// chaining
log(
  _.chain([1, 2, 3])
    .map(function (n) {
      return n * 2;
    })
    .filter(function (n) {
      return n <= 4;
    })
    .value()
);
// _.chain을 사용하면 코드를 위에서 아래로  읽을 수 있게 된다.

// 필터가 끝까지 안돌게 하려면?
var list = _.range(50);

_.filterLimit = function (data, predicate, limit) {
  var list = [];
  _.find(data, function (val, key, data) {
    return predicate(val, key, data) && list.push(val) == limit;
  });
  return list;
};

log(
  _.filterLimit(
    list,
    function (num) {
      return num % 2 == 0;
    },
    5
  )
); // 9번 반복
