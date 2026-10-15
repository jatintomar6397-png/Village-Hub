const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/villagehub';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    isMongoConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isMongoConnected = false;
    console.warn(`MongoDB Connection Failed: ${error.message}`);
    console.warn('JSON file fallback is active (JsonStore).');
    return null;
  }
};

// Monitor connection events if connected initially
mongoose.connection.on('connected', () => {
  isMongoConnected = true;
});

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
});

class JsonStore {
  constructor(filename) {
    this.dir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir, { recursive: true });
    }
    const fname = filename.endsWith('.json') ? filename : `${filename}.json`;
    this.filePath = path.join(this.dir, fname);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  _read() {
    try {
      if (!fs.existsSync(this.filePath)) {
        return [];
      }
      const content = fs.readFileSync(this.filePath, 'utf-8');
      return content ? JSON.parse(content) : [];
    } catch (err) {
      console.error(`Error reading ${this.filePath}:`, err.message);
      return [];
    }
  }

  _write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error(`Error writing ${this.filePath}:`, err.message);
    }
  }

  getAll() {
    return this._read();
  }

  getById(id) {
    const items = this._read();
    return (
      items.find(
        (item) =>
          item._id === id ||
          String(item._id) === String(id) ||
          item.id === id ||
          String(item.id) === String(id)
      ) || null
    );
  }

  create(item) {
    const items = this._read();
    const newItem = {
      _id:
        item._id ||
        Date.now().toString(36) + Math.random().toString(36).substring(2, 9),
      ...item,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString()
    };
    items.push(newItem);
    this._write(items);
    return newItem;
  }

  update(id, data) {
    const items = this._read();
    const index = items.findIndex(
      (item) =>
        item._id === id ||
        String(item._id) === String(id) ||
        item.id === id ||
        String(item.id) === String(id)
    );
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...data,
      _id: items[index]._id,
      updatedAt: new Date().toISOString()
    };
    this._write(items);
    return items[index];
  }

  delete(id) {
    const items = this._read();
    const index = items.findIndex(
      (item) =>
        item._id === id ||
        String(item._id) === String(id) ||
        item.id === id ||
        String(item.id) === String(id)
    );
    if (index === -1) return false;

    const deleted = items.splice(index, 1)[0];
    this._write(items);
    return deleted;
  }

  find(query = {}) {
    const items = this._read();
    return items.filter((item) => {
      return Object.keys(query).every((key) => item[key] === query[key]);
    });
  }

  clear() {
    this._write([]);
  }
}

const getMongoConnected = () => isMongoConnected;

module.exports = {
  connectDB,
  getMongoConnected,
  get isMongoConnected() {
    return isMongoConnected;
  },
  JsonStore
};
