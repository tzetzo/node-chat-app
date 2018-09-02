const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message.js')

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

describe('generateLocationMessage', () => {

    it('should generate correct location object', () => {

      const from = 'Tzetzo';
      const lat = 1;
      const lon = 1;

      const result = generateLocationMessage(from, lat, lon);

      expect(result.from).toBe(from);
      expect(result.url).toBe(`https://www.google.com/maps?q=${lat},${lon}`);
      expect(typeof result.createdOn).toBe('number');

    });

});
