const mineflayer = require('mineflayer');
const { Ollama } = require('ollama');
const readline = require('readline');

const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });
const AI_CONTEXT = "You are a sentient Minecraft player named LlamaBot. Keep your answers brief and fun!";

// This creates an interface to read inputs from your CMD window
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('🔌 Enter the current Minecraft LAN Port: ', (lanPort) => {
  console.log(`🚀 Connecting to port ${lanPort}...`);
  
  const bot = mineflayer.createBot({
    host: 'localhost',
    port: parseInt(lanPort),
    username: 'LlamaBot',
    version: '1.16.5',
    auth: 'offline'
  });

  bot.on('spawn', () => console.log('🤖 LlamaBot has spawned!'));

  bot.on('chat', async (username, message) => {
    if (username === bot.username) return;
    bot.chat("Thinking...");
    try {
      const response = await ollama.chat({
        model: 'llama3.2:1b',
        messages: [
          { role: 'system', content: AI_CONTEXT },
          { role: 'user', content: `${username} says: ${message}` }
        ]
      });
      bot.chat(response.message.content.trim());
    } catch (error) {
      bot.chat("My brain chip dropped its link.");
    }
  });

  bot.on('kicked', console.log);
  bot.on('error', console.error);
  rl.close();
});