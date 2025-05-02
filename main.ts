async function handler() {
  const html = await Deno.readTextFile("./index.html");
  const response = new Response(html, {
    headers: {
      "content-type": "text/html",
    },
  });
  
  return response;
}

Deno.serve(handler);