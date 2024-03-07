## How to use?

**Easy to use!**

## ?Example¿
```js
const { Storage } = require("robin-db");
const db = new Storage({
  path: "myDb",
  table: ["users"],
  extname: ".sql" // aslo .json
  // key: "your_key",
});

(async function main() {
  await db.setData("users", "money", { uid: 1234, money: 500, sybol: "$" }).then(() => {
    console.log("Data recorded successfully");
  });
  const value = await db.getData("users", "money").then(console.log);
  // if there is key
  await db.setData("users", "bio", "i love cats:0", "your_key");
})();
```
> **Docs: https://docs.robin.surge.sh**
