import os
from dotenv import load_dotenv
from openai import OpenAI

# Load variables from the .env file
load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")
base_url = os.getenv("OPENROUTER_API_BASE", "https://openrouter.ai/api/v1")
model = os.getenv("BIS_LLM_MODEL", "openrouter/free")

if not api_key:
    raise RuntimeError(
        "OPENROUTER_API_KEY is missing. Add it to the .env file."
    )

client = OpenAI(
    base_url=base_url,
    api_key=api_key,
)

question = input("Enter your question: ").strip()

if not question:
    print("Please enter a question.")
    raise SystemExit(1)

try:
    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "user",
                "content": question,
            }
        ],
        temperature=0,
        max_tokens=800,
    )

    answer = response.choices[0].message.content

    print("\nAPI Response")
    print("------------")
    print(f"Model: {response.model}")
    print(f"Question: {question}")
    print(f"\nAI: {answer}")

except Exception as error:
    print("\nAPI request failed:")
    print(error)
