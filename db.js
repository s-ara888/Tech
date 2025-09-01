const mongoose = require('mongoose');

const uri = "YOUR_CONNECTION_STRING_HERE"; // paste your string
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected!"))
.catch(err => console.log("MongoDB Connection Error:", err));

module.exports = mongoose;
