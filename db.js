const mongoose = require("mongoose");
const server = 'mongodb://localhost:27017'
const database = 'Hakki';

mongoose.connect(`${server}/${database}`, {
   useNewUrlParser: true,
   useUnifiedTopology: true
}).then(() => {
   console.log("Successfully connect to MongoDB.");
}).catch(err => {
   console.log("Erro: " + err);
   process.exit();
});

const Shema = mongoose.Schema;
const UserShema = new Shema({
   nome: {
      type: String,
      required: true
   },
   senha: {
      type: String,
      required: true
   }
});

const users = mongoose.model("Users", UserShema);

module.exports = users;