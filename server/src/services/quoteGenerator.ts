interface Quote {
  text: string
  author: string
}

const QUOTES: Quote[] = [
  {
    text: "Do or do not. There is no try. Only in our minds do we create the barriers that prevent us from doing. If you allow failure to define you, you have already failed before you begin.",
    author: "Yoda"
  },
  {
    text: "I find your lack of faith disturbing. The Force binds all living things together, and when you doubt its power, you sever yourself from it.",
    author: "Darth Vader"
  },
  {
    text: "It's not who I am underneath, but what I do that defines me. A man is more than just flesh and bone; he is the sum of his actions and the choices he makes in the darkness.",
    author: "Batman"
  },
  {
    text: "With great power comes great responsibility. You must choose whether to use your gifts for good or to turn away from those who depend on you.",
    author: "Uncle Ben"
  },
  {
    text: "Why so serious? Introduce a little anarchy, upset the established order, and everything becomes chaos. Isn't it beautiful?",
    author: "The Joker"
  },
  {
    text: "I am inevitable. My coming has been written into the fabric of existence itself, and nothing you do can change what must come to pass.",
    author: "Thanos"
  },
  {
    text: "You can't sit with us. But that doesn't mean you're not worthy of respect and friendship. Sometimes you have to earn your place in the circle.",
    author: "The Plastics"
  },
  {
    text: "I drink and I know things. Wisdom comes from experience, and experience often comes from mistakes made when judgment is impaired.",
    author: "Tyrion Lannister"
  },
  {
    text: "One does not simply walk into Mordor. The path is fraught with danger, and even the smallest creature can change the course of history.",
    author: "Boromir"
  },
  {
    text: "May the Force be with you. It is an energy field created by all living things, and it binds the galaxy together.",
    author: "Han Solo"
  },
  {
    text: "The night is dark and full of terrors. We must face our fears if we are ever to see the dawn.",
    author: "Game of Thrones"
  },
  {
    text: "I'm Batman. I work alone in the shadows, using fear as a weapon against those who prey upon the innocent.",
    author: "Batman"
  },
  {
    text: "To infinity and beyond! There is always another horizon, another dream to chase, another frontier to explore.",
    author: "Buzz Lightyear"
  },
  {
    text: "You miss 100% of the shots you don't take. Success requires courage, persistence, and a willingness to fail publicly.",
    author: "Wayne Gretzky"
  },
  {
    text: "That's what she said. But in all seriousness, perseverance and hard work are the keys to achieving your dreams.",
    author: "Michael Scott"
  },
  {
    text: "I'm vengeance. I'm the night. I am the darkness that hunts those who hunt the innocent.",
    author: "Batman"
  },
  {
    text: "Live long and prosper. Let reason and logic guide your path, and remember that the needs of the many outweigh the needs of the few.",
    author: "Spock"
  },
  {
    text: "I volunteer as tribute! Sometimes the greatest act of courage is to sacrifice yourself for those you love.",
    author: "Katniss Everdeen"
  },
  {
    text: "Avengers, assemble! United we stand stronger than any of us could be alone, and together we can face any threat.",
    author: "Captain America"
  },
  {
    text: "The only way out is through. Whatever obstacles stand before you, the only path forward is to face them head-on with determination.",
    author: "Robert Frost"
  }
]

export const generateRandomQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * QUOTES.length)
  return QUOTES[randomIndex]
}
