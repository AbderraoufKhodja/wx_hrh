export async function aiLanguageProcessing(article: string): Promise<any> {
  const apiKey = process.env.GENERATIVE_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const headers = {
    'Content-Type': 'application/json'
  };

  const body = JSON.stringify({
    contents: [{
      parts: [{
        text: 'Rewrite the coming script in chinese to a chinese audience living in algeria, make the output in HTML format, remove any script tag, make headers bold, add title tag, add a short engaging abstract inside abstract tag, title must in the header, abstract must bin the header inside a meta tag with attribute name content. SCRIPT: ' + article
      }]
    }]
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error('Error generating content:', error);
  }
}
