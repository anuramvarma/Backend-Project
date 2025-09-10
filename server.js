require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { sendWelcomeEmail, verifyEmailConfig } = require("./emailService");

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

// Verify email configuration on startup
verifyEmailConfig();
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
  try {
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
      return;
    }

    // Create new user
    const newUser = await user.create({
      Name: name,
      Email: email,
      Password: hashedPassword,
    });

    // Sendinng welcome email
    const emailResult = await sendWelcomeEmail(email, name);
    
    if (emailResult.success) {
      console.log(`Welcome email sent successfully to ${email}`);
    } else {
      console.error(`Failed to send welcome email to ${email}:`, emailResult.error);
    }

    res.redirect("/login");
  } catch (error) {
    console.error("Error in signup process:", error);
    res.send(`
      <script>
        alert("An error occurred during registration. Please try again.");
        window.location.href = "/signup";
      </script>
    `);
  }
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
        window.location.href = "/signup";
      </script>
    `);
  }
});

app.listen(5050, () => {
  console.log("The Server is running on http://localhost:5050");
});
