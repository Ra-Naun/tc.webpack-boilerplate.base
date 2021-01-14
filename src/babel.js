async function example(params) {
  return await Promise.resolve('async is working');
}

example()
  .then((res) => {
    console.log('isAsync? ', res);
  })
  .catch((err) => {
    console.log('err: ', err);
  });

//

class Util {
  static id = Date.now();
}

console.log('Util Id:', Util.id);
