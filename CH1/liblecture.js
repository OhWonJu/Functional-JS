const filter = (iter, predicate) => {
  const new_list = [];
  for (let i = 0, len = iter.length; i < len; i++) {
    if (predicate(iter[i])) new_list.push(iter[i]); // 결과에만 의존한다. (부가결과 방지?)
  }
  return new_list;
};

const map = (list, iteratee) => {
  const new_list = [];
  for (let i = 0, len = list.length; i < len; i++) {
    new_list.push(iteratee(list[i]));
  }
  return new_list;
};

function log_length(value) {
  log(value.length);
  return value;
}

function bValue(key) {
  return function (obj) {
    return obj[key];
  };
}
