# Finding Bigfoot with JavaScript + vector search

This repository contains a sample application that uses Semantic Search to find Bigfoot sightings in Redis. It uses a lot of popular AI libraries to make it work, but I had three things I wanted to show when I wrote this:

 1. You don't have to use Python to use AI.
 2. You don't have to plop down a credit card to use AI.
 3. You can run AI on your local machine.

To that end, I used JavaScript, and only JavaScript to build a simple web application. There's no Python to be found. Not that Python is bad, just that lots of us like JavaScript too.

I used the following bits of tech to make this possible:

 - [Node.js](https://nodejs.org/en)
 - [LangChain.js](https://github.com/langchain-ai/langchainjs)
 - [node-llama-cpp](https://withcatai.github.io/node-llama-cpp/)
 - [Transformers.js](https://xenova.github.io/transformers.js/)
 - [Express](https://expressjs.com/)
 - [Lit](https://lit.dev/)
 - [tailwindcss](https://tailwindcss.com/)
 - [Vite](https://vitejs.dev/)

But most importantly, I used [Redis](https://redis.io/docs/about/about-stack/) and [Node Redis](https://github.com/redis/node-redis).


## Get Started

If you're a Docker user, once you've cloned the repo you can get up and running quickly with:

```bash
docker compose up
```

This will launch four containers:

 1. An instance of Redis that's preloaded with a bunch of Bigfoot sightings and exposed on port 6379.
 2. An API written in Express with endpoints to search, fetch, and add Bigfoot sightings.
 3. A web app written with Lit and tailwindcss that lets you search and view Bigfoot sightings.
 4. An nginx gateway that binds and exposes the API and web app on port 8080.

> Note: If you have Redis running on your local machine, the first container won't be able to start. So, shut down existing versions of Redis before you start.

Once you've done that, you should be able to hit the app by browsing to http://localhost:8080. Search for some sightings. Click on ones that interest you. The search is semantic, so you can search for concepts instead of specific words. Some of my favorite searches include:

 - near a body of water at night
 - involving alcohol
 - found a footprint
 - during winter
 - in the desert


## If You're Not Using Docker

Getting up and running without Docker is totally possible, but a bit more work. You'll need to make sure you have the following installed before starting:

 - A recent version of [Node.js](https://nodejs.org/en). I used version 18, but any version that supports top-level await should work.
 - The latest version of [Redis](https://redis.io/docs/install/install-stack/). Follow the instructions in the link to get it installed *and* running.

You can confirm that Redis is running by using [RedisInsight](https://redis.io/docs/install/install-redisinsight/) to connect to it.


### Install Packages

Now we need to install the packages that the API and the web app need. For the API, run the following in the `api` folder:

```bash
npm install
```

And likewise, for the web app, run this in the `web` folder:

```bash
npm install
```

Sensing a theme?


### Start Services

Everything is installed. Now we can start the API and web app services, each in their own terminal. Start with the API from the `api` folder:

```bash
npm start
```

And then with the web app in the `web` folder:

```bash
npm run dev
```

Go ahead and test the service by going to the URL that `npm run dev` provides. Search for some sightings and you'll immediately notice something—there aren't any. This is because when you run without Docker and install your own Redis, you won't have any sightings preloaded. I used Docker to load all the sightings into Redis and since you're not using Docker, you'll need to load some on your own. Which is a great segue to the next topic...


## Loading More Sightings

The API provides an endpoint to load a Bigfoot sighting. You can try it out by posting a JSON document to the API using curl:

```bash
curl -X POST http://localhost:8080/api/load \
 --silent \
 --header "Content-Type: application/json" \
 --data '{ "id": "65535", "observed": "I saw Bigfoot at Walmart buying flip-flops. Apparently, he wears a size 17.", "county": "Athens", "state": "Ohio", "classification": "Class A", "timestamp": 205286400 }'
```

> Note: If you're not using Docker, change the port on the URL to 3000.

What this endpoint does is two-fold:

 1. It adds all the data you provided it to a Hash in Redis.
 2. It adds the `id` and text in the `observed` property to an event stream so that it can be summarized and embedded by another service.

You can go into Redis Insight and look at this yourself to confirm that it has worked. It will be in the key `bigfoot:sighting:65535`. And, if you look in the stream `bigfoot:sighting:report` you should see it at the top of the stream.

You can also use the web application to see by browsing to http://localhost:8080/sighting/65535 (or the comparable URL for the web app service if you're not running Docker). Note that there isn't a summary in the results like there is for other sightings. This is because the summary hasn't been created yet. And this is because the embedder service isn't running.

So, let's launch the embedder service. This will summarize and embed what it reads from the event stream and then update the Hash with that summarization and embedding.


### Setting Up and Launching the Embedder

To run the embedder, you'll need to download the model it makes use of. Normally, I'd have put it in the repo, but the model file is way big and won't fit in GitHub—even if I use Git LFS. So, you need to download it at:

https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/blob/main/mistral-7b-instruct-v0.2.Q4_K_M.gguf

Note that at a little over 4 gigs, this ain't a small file. The download might take a while, but it's easy enough to install. Once you've downloaded it, just copy it to `embedders\models`.

The rest is easy as it's just another Node.js app. So, from the `embedder` folder install all the packages:

```bash
npm install
```

And then launch the service:

```bash
npm start
```

> Note: If you are using an Intel-based Mac like me, you might need to change how Metal is used. Details are [here](https://withcatai.github.io/node-llama-cpp/guide/Metal) but the magic command is:
>
> ```bash
> npx --no node-llama-cpp download --no-metal
> ```

Summarization can take a while depending on the computer you are using. On my older Intel-based Mac, it takes between 30-90 seconds to summarize the text. So be patient.

If you are adding lots of sightings, you can run several embedders in parallel. Just open more terminal windows and run `npm start` in each of them. I typically run 4 of them on my system, which has 32 gigs of RAM.


## Loading Lots of Sightings

If you're not using Docker, you'll need to load all of the Bigfoot sightings. All 4,586 of them. This would be tedious, but fortunately there's another tool in the `loader` folder. You can point this tool at an endpoint (i.e. http://localhost:3000/api/load) and a JSONL file, and it will call that endpoint for each entry in that file.

It's a Node.js app, like everything here, so you need to install the packages before you can use it:

```bash
npm install
```

Once there, you can run it. Let's get the help:

```bash
npm start -- --help
```

```bash
Synopsis

 $ npm start -- file [--startingId id] [--endpoint url]
 $ npm start -- --help

Options

 --endpoint url The URL of the API endpoint to post sightings to. Optional.
 Defaults to http://localhost:8080/api/load.
 --startingId id Optional. Skip entries in file until this ID is found.
 --help string Print this usage guide.
```

Conveniently, the `data` folder has a JSONL file with all 4,586 Bigfoot sightings in it. So, to load them, just run the following command:

```bash
npm start -- ../data/bfro_reports_geocoded.jsonl --endpoint http://localhost:3000/api/load
```

This'll run super fast as it's just adding each sighting to a Hash and an event stream. From there, the embedder(s) will take over.


## Next Steps

There's a lot that could be expanded in this app. Check out the code and see what you can do with it. Here's a couple of ideas:

 - The search endpoint can take discrete parameters like `state` or `classification` that enable filtered search. But there are only a few fields implemented and the UI doesn't do anything with them. Add some fields and add a UI to support it.
 - The UI doesn't provide a way to add a Bigfoot sighting directly. It probably should.
 - There's no mechanism to *edit* a Bigfoot sightings. You could add endpoints and the UI to do this. Keep in mind that if you change the `observed` field, you'll need to update to embedding and summary as well. You'll probably need to drop an event on a stream.


## Contributing

If you found this useful, please share it. If you find a bug, a typo, or whatever, send me a pull request and I'll get it merged. If you add more functionality, keep that for yourself. We want others to be able to learn from this codebase as well.

Thanks and good luck in your hunt for Bigfoot.
