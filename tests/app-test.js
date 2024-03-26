const request = require("supertest");
const app = require("../app");
const expect = require("chai").expect;

describe("GET /", () => {
  it("renders the index.ejs template", (done) => {
    request(app)
      .get("/")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.text).to.include("Meme Store");
        done();
      });
  });

  it("renders the first meme", (done) => {
    request(app)
      .get("/")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.text).to.include("Memes that make us smile");
        expect(res.text).to.include("$20.00 - $30.00");
        done();
      });
  });
});

describe("GET /add-meme", () => {
  it("includes a form with POST request to /memes", (done) => {
    request(app)
      .get("/add-meme")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.text).to.include("form");
        expect(res.text).to.include("input");
        expect((res.text.match(/input/g) || []).length).to.greaterThanOrEqual(3);
        expect(res.text).to.include('action="/memes"');
        expect(res.text.toLowerCase()).to.include('method="post"');
        done();
      });
  });
});

describe("POST /memes", () => {
  it("redirects to / and displays new meme", (done) => {
    const newMeme = {
      name: "A new meme",
      imgURL:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrvgAEPZAll8POW05lcODidBj2sPC1ECwyLQ&usqp=CAUm",
      price: "$5",
    };

    request(app)
      .post("/memes")
      .set("Content-Type", "application/json")
      .send(newMeme)
      .expect("Content-Type", "text/html; charset=utf-8")
      .redirects(1)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.include("A new meme");
        expect(res.text).to.include("$5");
        done();
      });
  });
});
