import  os
from openai import OpenAI

def paraphrase(text):
  if os.getenv('CHATGPT_ENABLE'):
      client = OpenAI()
      completion = client.chat.completions.create(
        model="gpt-4",
        messages=[
          {"role": "system", "content": "You are a helpful assistant to do the elabrate into 100 words of the given text. Avtive voice"},
          {"role": "user", "content": text }
        ]
      )
      result = completion.choices[0].message.content
  else:
      result = text

  return result
