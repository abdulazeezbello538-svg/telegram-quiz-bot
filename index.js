import TelegramBot from "node-telegram-bot-api";

// Railway will provide this
const token = process.env.BOT_TOKEN;

// Start bot
const bot = new TelegramBot(token, { polling: true });

// Questions
const questions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Madrid"],
    answer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars"
  },
  {
    question: "Who wrote Romeo and Juliet?",
    options: ["Shakespeare", "Hemingway", "Tolstoy", "Dickens"],
    answer: "Shakespeare"
  },
  {
    question: "What is 5 + 7?",
    options: ["10", "11", "12", "13"],
    answer: "12"
  },
  {
    question: "What is the largest ocean?",
    options: ["Atlantic", "Indian", "Pacific", "Arctic"],
    answer: "Pacific"
  }
];

// Store user progress
const userState = {};

// Start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  userState[chatId] = {
    score: 0,
    current: 0
  };

  bot.sendMessage(chatId, "🎯 Welcome to the Professional Quiz Bot!\n\nLet’s begin!");

  sendQuestion(chatId);
});

// Send question function
function sendQuestion(chatId) {
  const user = userState[chatId];
  const questionData = questions[user.current];

  if (!questionData) {
    bot.sendMessage(
      chatId,
      `🏁 Quiz Finished!\n\nYour Score: ${user.score}/${questions.length}`
    );
    return;
  }

  bot.sendPoll(chatId, questionData.question, questionData.options, {
    type: "quiz",
    correct_option_id: questionData.options.indexOf(questionData.answer),
    is_anonymous: false
  });
}

// Handle poll answers
bot.on("poll_answer", (pollAnswer) => {
  const chatId = pollAnswer.user.id;
  const user = userState[chatId];

  if (!user) return;

  const questionData = questions[user.current];

  const selectedOption =
    questionData.options[pollAnswer.option_ids[0]];

  if (selectedOption === questionData.answer) {
    user.score++;
  }

  user.current++;

  setTimeout(() => {
    sendQuestion(chatId);
  }, 1000);
});

console.log("Bot is running...");
    
