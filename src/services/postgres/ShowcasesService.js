const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class ShowcasesService {
  constructor() {
    this._pool = new Pool();
  }

  async addShowCases(userId) {
    const showCaseId = `showcase-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO showcases (showcase_id, owner) VALUES($1, $2)',
      values: [showCaseId, userId],
    };

    await this._pool.query(query);
  }
}

module.exports = ShowcasesService;
