const appellations = require("./appellations.json");

class Users {
  constructor() {
    this.users = [];
    this.appellations = appellations;
  }

  /** Добавление пользователя */
  add(token, room, device) {
    const room_users = this.getByRoom(room);

    let category;

    if (room_users.length) {
      category = room_users[0].category;
    } else {
      const keys = Object.keys(this.appellations);
      category = keys[Math.floor(Math.random() * keys.length)];
    }

    let name;

    const name_list = this.appellations[category].list;
    while (true) {
      name = name_list[Math.floor(Math.random() * name_list.length)];
      if (!room_users.map(e => e.name).includes(name)) break;
    }

    let icons = [];
    if (!room_users.length) {
      icons.push({ icon: "mdi-crown" });
    }

    if (device.mobile) {
      if (device.android) {
        icons.push({ icon: "mdi-android" });
      } else if (device.ios) {
        icons.push({ icon: "mdi-apple" });
      } else {
        icons.push({ icon: "mdi-cellphone" });
      }
    }

    const u = {
      id: token,
      name,
      category,
      room,
      king: !room_users.length,
      icons
    };

    this.users.push(u);
    return u;
  }

  /** Удаление пользователя */
  remove(token) {
    const user = this.get(token);
    this.users = this.users.filter(user => user.id !== token);
    return user;
  }

  /** Один пользователь */
  get(token) {
    return this.users.find(user => user.id === token);
  }

  /** Все пользователи в комнате */
  getByRoom(room) {
    return this.users.filter(user => user.room === room);
  }

  /** Возвращает true, если комната заполнена */
  isFull(room) {
    let max_length = Infinity;
    const room_users = this.getByRoom(room);

    if (room_users.length) {
      max_length = this.appellations[room_users[0].category].length;
    }

    return room_users.length >= max_length;
  }

  /** Возвращает true, если королей больше одного */
  oneKing(data) {
    if (!data.king) return false;
    return this.getByRoom(data.room).filter(e => e.king === true).length;
  }
}

module.exports = function() {
  return new Users();
};
