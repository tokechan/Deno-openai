import OpenAI from "https://deno.land/x/openai@v4.62.1/mod.ts"

const openai = new OpenAI({
  apiKey: Deno.env.get("OPNEAI_API_KEY"),
});

const RECIPE_ROUTE = new URLPattern({ pathname: "/:name"});

async function handler(req: Request) {
  const match = RECIPE_ROUTE.exec(req.url);
  const name: string = match?.pathname.groups.name ?? "肉じゃが";
  

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "レシピ作成アシスタント" },
      { role: "user", content: name },
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


