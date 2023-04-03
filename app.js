const express = require("express");
const app = express();
const fs = require("fs");
const id = require("uniqid");
const port = 3000;

app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  let created = req.query.created;

  let medicines = GetAll("medicines");

  if (created) {
    res.render("list", { created: true, medicines: medicines });
  } else {
    res.render("list", { created: false, medicines: medicines });
  }
});

app.get("/create", (req, res) => {
  res.render("create");
});
// .....................................................................
app.get("/detail", (req, res) => {
  let created = req.query.created;

  let medicines = GetAll("medicines");

  if (created) {
    res.render("detail", { created: true, medicines: medicines });
  } else {
    res.render("detail", { created: false, medicines: medicines });
  }
});
// ................................................................
app.post("/create", (req, res) => {
  let data = req.body;
  let medicine = {
    id: id(),
    Name: data.Name,
    Country: data.Country,
    Purpose: data.Purpose,
    Price: data.Price,
  };

  let medicines = GetAll("medicines");

  medicines.push(medicine);

  WriteAll("medicines", medicines);
  res.redirect("/?created=true");
});

app.get("/:id/delete", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/medicines.json", (err, data) => {
    if (err) throw err;

    const medicines = JSON.parse(data);

    const filteredMedicines = medicines.filter((medicine) => medicine.id != id);

    fs.writeFile(
      "./data/medicines.json",
      JSON.stringify(filteredMedicines),
      (err) => {
        if (err) throw err;

        res.render("list", { medicines: filteredMedicines, deleted: true });
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function GetAll(filename) {
  return JSON.parse(fs.readFileSync(`./data/${filename}.json`));
}

function WriteAll(filename, data) {
  return JSON.stringify(
    fs.writeFileSync(`./data/${filename}.json`, JSON.stringify(data))
  );
}
