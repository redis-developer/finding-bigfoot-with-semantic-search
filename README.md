# Finding Bigfoot with JavaScript + Vector Search

This is the repository for a live stream where I using LangChain.js, Redis Vector Search, and assorted models to find Bigfoot using semantic search.

The stream is available at:
https://www.youtube.com/watch?v=R1IXYnoSd5U

## Getting it Running

This is a work in progress so nothing solid here yet. However, the model file is too big to store in GitHub—even if you use Git LFS. So, you'll need to download it yourself at:

https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/blob/main/mistral-7b-instruct-v0.2.Q4_K_M.gguf

More to come on how to get it running once I get it running myself!


If you are using an Intel-based Mac, you might need to change how Metal is installed. Details are [here](https://withcatai.github.io/node-llama-cpp/guide/Metal) but the magic command is:

```bash
npx --no node-llama-cpp download --no-metal
```


Start with:

```bash
docker compose up -d
```

Embedder is not started by default. To start, use npm:

```bash
cd embedder
npm start
```

You can start as many of these as your CPU or GPU is happy to run. The will gladly run in parallel.
