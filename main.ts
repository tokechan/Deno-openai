import OpenAI from "https://deno.land/x/openai@v4.62.1/mod.ts"

const openai = new OpenAI({
  apiKey: Deno.env.get("OPNEAI_API_KEY"),
});

async function handler() {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "レシピ作成アシスタント"},
      { role: "user", content: "豚の角煮"},
    ],
    model: "gpt-4o-mini",
    stream: true,
  });

  const body = new ReadableStream({
    async start(controller) {
      for await (const chunk of completion) {
        const message = chunk.choices[0].delta.content;
        if(message === undefined) {
          controller.close();
          return;
      }
      controller.enqueue(new TextEncoder().encode(message ?? ""));
      }
    },
  });

  const response = new Response(body, {
    headers: {
      "content-type": "text/plain;charset=utf-8",
    },
  });
  
  return response;
}

Deno.serve(handler);


