//used for my feature enhancement:
const _ = require('lodash');

// we need to save every User (with id, name & room) that joins the chat so we can access him later when emitting events
//instead of defining an array and methods on their own we will use the ES6 Class approach; 124 lesson

// var users = [];
// var addUser = (id, name, room) => {
//     users.push({});
// }
// module.export = {addUsers};


//when we create a new Instance we want to start with an empty array of users:
class Users {
    constructor () {
      //all users are stored in one array:
      this.users = [];  //this refers to the instance as opposed to the Class
    }
    addUser (id, name, room) {
      const user = {id, name, room};
      this.users.push(user);
      return user;
    }
    removeUser (id) {
      //we will need to know the removed user name and room to let the ohers know he left the room:
      const user = this.getUser(id);

      if (user) {
        this.users = this.users.filter(user => user.id !== id);
      }

      return user;
    }
    getUser (id) {
      return this.users.filter(user => user.id === id)[0];
    }
    getUserList (room) {
      const users = this.users.filter(user => user.room === room);
      const namesArray = users.map(user => user.name);
      return namesArray;
    }

    //new feature to get the currently available rooms for the new user to choose from:
    getRoomsList () {
      return _.uniqBy(this.users, 'room').map(user => user.room);
    }
}

module.exports = {Users};
