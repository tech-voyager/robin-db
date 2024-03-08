## How to use?

**Easy to use!**

## ?Example¿
```js
const { Storage } = require("robin-db");

const storage = new Storage({ path: "data", table: ["users"], extname: ".json" });

// add values
storage.set("users", "1", { name: "John", age: 30, isAdmin: false });
storage.set("users", "2", { name: "Alice", age: 25, isAdmin: true });
storage.set("users", "3", { name: "Bob", age: 40, isAdmin: false });

console.log(storage.has("users", "1")); // return: true
console.log(storage.has("users", "4")); // return: false
// get values
const user = storage.get("users", "3")
const name = user.name;
console.log(user, ":", name);
```
> **Docs: https://docs.robin.surge.sh**
