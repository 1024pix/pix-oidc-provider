const { nanoid } = require("nanoid");

const store = new Map();
const logins = new Map();

class Account {
  constructor(id) {
    this.accountId = id ?? nanoid();
    store.set(this.accountId, this);
  }

  static async findAccount(context, id, token) {
    if (!store.get(id)) {
      new Account(id);
    }
    return store.get(id);
  }

  static async findByLogin(login) {
    if (!logins.get(login)) {
      logins.set(login, new Account(login));
    }
    return logins.get(login);
  }

  static async findByFederated(provider, claims) {
    const id = `${provider}.${claims.sub}`;
    if (!logins.get(id)) {
      logins.set(id, new Account(id, claims));
    }
    return logins.get(id);
  }

  async claims(use, scope) {
    return {
      sub: this.accountId, // it is essential to always return a sub claim
      family_name: 'Mâle',
      given_name: 'Annie'
    };
  }
}

module.exports = Account;
