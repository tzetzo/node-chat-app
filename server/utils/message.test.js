const expect = require('expect');

const {generateMessage} = require('./message.js')

describe('generateMessage', () => {

    it('should generate correct message object', () => {

      const from = 'Tzetzo';
      const text = 'test text';

      const result = generateMessage(from, text);
      
      expect(result.from).toBe(from);
      expect(result.text).toBe(text);
      expect(typeof result.createdOn).toBe('number');

    });

});
