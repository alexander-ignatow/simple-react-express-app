interface Quote {
  text: string
  author: string
}

const QUOTES: Quote[] = [
  {
    text: "Do or do not. There is no try. But honestly, mostly just try—a lot.",
    author: "Yoda"
  },
  {
    text: "I find your lack of faith disturbing. But hey, no pressure on your goals.",
    author: "Darth Vader"
  },
  {
    text: "It's not who I am underneath, but what I do that defines me. So I wear a cape.",
    author: "Batman"
  },
  {
    text: "With great power comes great responsibility. And apparently, a lot of therapy bills.",
    author: "Uncle Ben / Spider-Man"
  },
  {
    text: "Why so serious? Life's too short not to fail spectacularly.",
    author: "The Joker"
  },
  {
    text: "I am inevitable. So is disappointment, but we don't talk about that.",
    author: "Thanos"
  },
  {
    text: "You can't sit with us. But you can definitely try and build something cooler.",
    author: "The Plastics / Mean Girls"
  },
  {
    text: "I drink and I know things. Mostly that I have no idea what I'm doing.",
    author: "Tyrion Lannister"
  },
  {
    text: "One does not simply walk into Mordor. But one can definitely stumble forward.",
    author: "Boromir"
  },
  {
    text: "May the Force be with you. You're gonna need it.",
    author: "Han Solo"
  },
  {
    text: "The night is dark and full of terrors. Also deadlines.",
    author: "Game of Thrones"
  },
  {
    text: "I'm Batman. And Batman has a spreadsheet of todos.",
    author: "Batman"
  },
  {
    text: "To infinity and beyond! Reality check: infinity is expensive.",
    author: "Buzz Lightyear"
  },
  {
    text: "You miss 100% of the shots you don't take. You also miss most of the ones you do.",
    author: "Wayne Gretzky / The Office"
  },
  {
    text: "That's what she said. But seriously, keep trying, it gets easier.",
    author: "Michael Scott"
  },
  {
    text: "I'm vengeance. I'm the night. I'm also procrastinating on my goals.",
    author: "Batman"
  },
  {
    text: "Live long and prosper. Long enough to see your startup fail, apparently.",
    author: "Spock"
  },
  {
    text: "I volunteer as tribute! For everything I'm wildly unprepared for.",
    author: "Katniss Everdeen"
  },
  {
    text: "Avengers, assemble! To discuss why nothing ever gets done on schedule.",
    author: "Captain America"
  },
  {
    text: "The only way out is through. Preferably on a Friday.",
    author: "Various Wise People"
  }
]

export const generateRandomQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * QUOTES.length)
  return QUOTES[randomIndex]
}
