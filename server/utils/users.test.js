const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
    let users;

    //called before every if() test case:
    beforeEach(() => {
        users = new Users();
        users.users = [{
          id: '1',
          name: 'Mike',
          room: 'Node course'
        },{
          id: '2',
          name: 'Jenny',
          room: 'React course'
        },{
          id: '3',
          name: 'Tzvetan',
          room: 'Node course'
        }]
    });

    it('should add new user', () => {
        const users = new Users();
        const user = {
          id: '123',
          name: 'Tzvetan',
          room: 'The office fans'
        }
        const returned_user = users.addUser(user.id, user.name, user.room);
        expect(typeof returned_user).toBe('object');
        expect(returned_user.id).toBe('123');
        expect(users.users).toEqual([user]);
    });

    it('should remove a user', () => {
        const user = users.removeUser(users.users[0].id);
        expect(typeof user).toBe('object');
        expect(user.id).toBe("1");
        expect(users.users.length).toBe(2);
    });

    it('should not remove a user', () => {
        const user = users.removeUser('99');
        expect(typeof user).toBe('undefined');
        expect(users.users.length).toBe(3);
    });

    it('should get user', () => {
        const user = users.getUser(users.users[0].id);
        expect(typeof user).toBe('object');
        expect(user.id).toBe("1");
        expect(users.users.length).toBe(3);
    });

    it('should not get user', () => {
      const user = users.getUser('45');
      expect(typeof user).toBe('undefined');
      expect(users.users.length).toBe(3);
    });

    it('should return array of names for the "Node course" room', () => {
        const list = users.getUserList(users.users[0].room);
        expect(list.length).toBe(2);
        expect(list[0]).toBe(users.users[0].name);
        expect(list[1]).toBe(users.users[2].name);
    });

});
