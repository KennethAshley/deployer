const _ = require('lodash');

const Framework = require('@vechain/connex-framework').Framework;
const ConnexDriver = require('@vechain/connex-driver');

const Contract = require("./UniswapV2Factory.json")

const factory = "0x4ef330a5c3f6a975427df1a4f583e5b34ce6076e";

const token1 = "0x2a487619f728c306a83a0b81c941466ef73c81a0";
const token2 = "0x0000000000000000000000000000456e65726779";

(async () => {
  const { Driver, SimpleNet, SimpleWallet } = ConnexDriver;

  const wallet = new SimpleWallet()
  // add account by importing private key
  wallet.import("0x6c17e54d9b425be4ce5ef3d47b0a2156a395bca41d74b33ab7b8abbd46f5c13a")

  const driver = await Driver.connect(new SimpleNet("http://testnet.veblocks.net"), wallet);
  const connex = new Framework(driver);

  const createPoolABI = _.find(Contract.abi, { name: 'createPair' });

  const createPoolMethod = connex.thor.account(factory).method(createPoolABI);

  const clause = createPoolMethod.asClause(token1, token2);

  connex.vendor
    .sign('tx', [{...clause}])
    .request()
    .then(response => {
      console.log(response);
    });

})();
