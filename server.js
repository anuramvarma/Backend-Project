const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

async function Mongoose() {
  try {
    await mongoose
      .connect(
        "mongodb+srv://anuramvarma:Anuram123456@cluster0.kfxkraa.mongodb.net/"
      )
      .then(() => {
        console.log("Connected Succesfully ✅");
      });
  } catch (err) {
    console.log(err);
  }
}
Mongoose();
//schema
const userSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  Password: {
    type: String,
    required: true,
  },
});
const user = mongoose.model("user", userSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname + "/public" });
});

app.get("/login", (req, res) => {
  res.sendFile("login.html", { root: __dirname + "/public" });
});

app.get("/signup", (req, res) => {
  res.sendFile("signup.html", { root: __dirname + "/public" });
});

app.post("/signupSubmit", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const check = await user.findOne({ Email: email });

  if (check) {
    res.send(`
      <script>
        alert("Email already Existed with us !");
        window.location.href = "/login";
      </script>
    `);
  }
  await user.create({
    Name: name,
    Email: email,
    Password: hashedPassword,
  });

  res.redirect("/login");
});

app.post("/loginSubmit", async (req, res) => {
  const { email, password } = req.body;
  const cred = await user.findOne({ Email: email });

  if (cred && (await bcrypt.compare(password, cred.Password))) {
    res.redirect("https://github-huntt.netlify.app");
  } else {
    res.send(`
    <script>
      alert("Enter Correct details");
      window.location.href = "/login";
    </script>
  `);
  }
});
app.post("/forgot", async (req, res) => {
  const { email, newPassword } = req.body;
  const data = await user.findOne({ Email: email });
  if (data) {
    const hashed = await bcrypt.hash(newPassword, 10);
    await user.findOneAndUpdate({ Email: email }, { Password: hashed });
    res.send(`
      <script>
        alert("New password has been Updated Successfully✅");
        window.location.href = "/login";
      </script>
    `);
  } else {
    res.send(`
      <script>
        alert("Your email is not found with us.");
        window.location.href = "/forgot";
      </script>
    `);
  }
});

app.listen(5050, () => {
  console.log("The Server is running on http://localhost:5050");
});
