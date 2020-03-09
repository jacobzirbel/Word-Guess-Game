var mainObject = {
  urls: [
    "https://www.potterapi.com/v1/spells/?key=$2a$10$CllyxXYJthJvjJkMupzvPeBgs8oL88MiueUrUF3F27s.IjByE2uKS",
    "https://www.potterapi.com/v1/characters/?key=$2a$10$CllyxXYJthJvjJkMupzvPeBgs8oL88MiueUrUF3F27s.IjByE2uKS"
  ],
  setData: function() {
    Promise.all([
      $.getJSON(this.urls[0]).then(data => {
        return data;
      }),
      $.getJSON(this.urls[1]).then(data => {
        return data;
      })
    ]).then(data => {
      this.data.push(...data[0]);
      this.data.push(...data[1]);
      this.playGame();
    });
  },
  data: [],
  currentWord: "",
  playGame: function() {
    debugger;
    let list = this.data;
    this.currentWord = list[Math.floor(Math.random() * list.length)].spell;
    console.log(this.currentWord);
  }
};

mainObject.setData();

// arr = [4];
// var obj = {
//   foo: function() {
//     console.log(this);
//     arr.forEach(e => {
//       console.log(this);
//     });
//   }
// };

// obj.foo();
