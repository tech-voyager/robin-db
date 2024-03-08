const fs = require("fs");
const path = require("path");
const { crypt } = require("../util/coding");
const { enCrypt } = require("../util/decoding");
const EventEmitter = require('events');

function get(table, dir, extname) {
  const filePath = path.join(process.cwd(), dir, table, "storage" + extname);
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch(e) {
    console.error("[Warning]: Error reading file!: " + e);
    return null;
  }
}

function set(table, dir, db, extname, encryption = false) {
  const content = JSON.stringify(db);
  const filePath = path.join(process.cwd(), dir, table, "storage" + extname);
  try {
    fs.writeFileSync(filePath, content);
  } catch(e) {
    console.error("Error writing file:", e);
  }
}

class Storage extends EventEmitter {
  constructor(options) {
    super(); // вызов конструктора родительского класса
    this.directory = options && options.path ? options.path : "database";
    this.tables = options && Array.isArray(options.table) ? options.table : ["main"];
    this.extname = options && options.extname ? options.extname : ".sql";

    if (!fs.existsSync(path.join(process.cwd(), this.directory))) {
      fs.mkdirSync(path.join(process.cwd(), this.directory));
    }

    let tableList = this.tables;
    if (!Array.isArray(tableList)) {
      throw new Error("Invalid table array");
    }
    if (!this.extname) {
      throw new Error("Invalid extension");
    }

    for (let i = 0; i < tableList.length; i++) {
      const tablePath = path.join(process.cwd(), `${this.directory}/${tableList[i]}`);
      if (!fs.existsSync(tablePath)) {
        fs.mkdirSync(tablePath);
      }

      const storagePath = path.join(process.cwd(), this.directory, tableList[i], `storage${this.extname}`);
      if (!fs.existsSync(storagePath)) {
        fs.writeFileSync(storagePath, "{}");
      }
    }
  }

  set(table, key, value, encryption = false) {
    if (!this.tables.includes(table))
      throw new Error("Invalid table name: " + table);
    const oldValue = this.get(table, key);
    let db = get(table, this.directory, this.extname);
    let values = value;
    if (encryption) {
      if (!this.key)
        throw new Error(
          "You need to specify 'key' in the class CreateStorage"
        );
      db[key] = {
        key: key,
        value: crypt(values, this.key),
      };
    } else if (encryption === false) {
      db[key] = {
        key: key,
        value: values,
      };
    } else {
      throw new Error("Invalid type 'set'");
    }
    const newValue = {
      table: table,
      path: this.directory,
      extname: this.extname,
      key: key,
      value: value,
      encryption: encryption,
    };
    set(table, this.directory, db, this.extname);
    this.emit("update", newValue, oldValue);
  }

  get(table, key) {
    let db = get(table, this.directory, this.extname);
    return db[key] ? db[key].value : undefined;
  }
  all(table) {
    let db = get(table, this.directory, this.extname);
    let allValue = [];
    for(const key in db) {
      if(Object.hasOwnProperty.call(db, key)) {
        allValue.push(db[key].value);
      }
    }
    return allValue;
  }
  has(table, key) {
    let db = get(table, this.directory, this.extname);
    return db.hasOwnProperty(key);
  }
  
  restart() {
    Object.keys(require.cahce).forEach(key => {
      delete require.cache[key];
    });
  }
  checkValues(table, logic) {
    let db = get(table, this.directory, this.extname);
    let keys = Object.keys(db);
    for(let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = db[key].value;
      let isVaild = false;
      
      switch(logic) {
        case "!not Object":
          isVaild = typeof value !== 'object';
          break;
        case "!not Bool":
          isVaild = typeof value !== 'boolean';
          break;
        case "!not Array":
          isVaild = !Array.isArray(value);
          break;
        case "!only Integer":
          isVaild = Number.isInteger(value);
          break;
        case "!equal":
          isVaild = this.checkEquality(value, logic.substring(8));
          break;
        case "!if Error do: not return":
          isValid = !(value instanceof Error);
          break;
        default:
          throw new Error("Invalid Logic!");
      }
      if(!isVaild) {
        return false;
      }
    }
  }
}

module.exports = { Storage };
