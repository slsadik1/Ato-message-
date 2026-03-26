import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

bot.on("message", async (msg) => {
  try {
    if (!msg.text) return;

    let userText = msg.text.toLowerCase();

    // Roast trigger words
    const roastTrigger = ["roast", "roast me", "gali de", "opoman", "insult"];

    let mode = "normal";

    if (roastTrigger.some(word => userText.includes(word))) {
      mode = "roast";
    }

    // spam control (normal 30%, roast always reply)
    if (mode === "normal" && Math.random() > 0.3) return;

    let systemPrompt = "";

    if (mode === "roast") {
      systemPrompt = `
You are a savage but funny Bangladeshi friend.
Roast the user in a playful, sarcastic way.
Do NOT use extreme abusive or harmful language.
Keep it funny, short, and entertaining.
Use Bangla slang.
      `;
    } else {
      systemPrompt = `
You are a funny Bangladeshi friend.
Reply like a human, short and witty.
Use Bangla language.
      `;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: msg.text },
      ],
    });

    const reply = response.choices[0].message.content;

    bot.sendMessage(msg.chat.id, reply, {
      reply_to_message_id: msg.message_id,
    });

  } catch (err) {
    console.log(err);
  }
});