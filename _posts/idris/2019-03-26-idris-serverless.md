---
layout: post
title: "Coding Serverless Function in Idris"
date: 2019-03-26
categories: Idris
isEditable: false
---

# Brief Intro to Serverless Computing

Serverless computing platforms such as [AWS Lambda](https://aws.amazon.com/lambda/) and [Google Cloud Functions](https://cloud.google.com/functions/) have recently become a hot trend for writing backend code. With serverless computing we don't need to setup, configure and maintain servers ourselves as it is handled automatically by the platform. Likewise, the platform will also automatically scale our code to more instances as needed, saving us both money and development time.

The fundamental abstraction of serverless computing are *serverless functions*, which is a piece of code that receives as input an HTTP request, and produces as output an HTTP response. If this is new to you, [check out this post](https://medium.com/@BoweiHan/an-introduction-to-serverless-and-faas-functions-as-a-service-fb5cec0417b2). Most commonly these serverless functions are written in JavaScript or Python, the architecture of serverless functions make functional programming languages such as [Haskell](https://www.haskell.org) a really nice fit. With Haskell we can get some good guarantees about our code due to its quite powerful type system. However, since we often house critical business logic inside these serverless functions, it would be great if we can get absolute assurance that our code is correct. For this reason I think that dependently-typed programming languages, in particular [Idris](https://www.idris-lang.org), are really interesting and promising languages for writing serverless functions.

# Writing Serverless Functions in Idris

In this post I want to walk through how we can write serverless functions in Idris and deploy them to Google Cloud. First, you need to make sure you have the necessary toolchains installed.

## Installing Stuff

First, Idris needs to be installed (see [here](https://www.idris-lang.org/download/) for more info). Assuming you already have Haskell and `cabal` installed, it should be as easy as:

```idris
cabal update
cabal install idris
```

In addition, for writing Idris code I highly recommend using the [Atom editor](https://atom.io) since Atom has a great Idris package `language-idris`.

Since this tutorial specifically shows how to deploy to Google Cloud Functions, you need to make sure to have the Google Cloud SDK command line tools installed if you want to follow along directly. On the other hand, the techniques shown below will probably work just as well with AWS Lambda if you would rather use that, I just won't give specific instructions since I haven't tried it yet. If you want to setup Google Cloud Functions SDK, you can [get started here](https://cloud.google.com/functions/).

## Writing a Function in Idris

In this post we won't be looking at using Idris to prove correctness of code, just how to get any code at all to run on Google Cloud Functions. We can start out by writing a simple hello world function in Idris by making a new file `function.idr` and putting in the following:

```idris
module MyFunction

hello : String -> String
hello req = "Hello: " ++ req
```

All that this function does is take as input a string (`req`), and concatenate at the beginning `"Hello: "`. You can test that this works by opening the Idris REPL with this file in your terminal, and calling the function:

```bash
$ idris function.idr
     ____    __     _
    /  _/___/ /____(_)____
    / // __  / ___/ / ___/     Version 1.3.1-git:268db5dc2
  _/ // /_/ / /  / (__  )      http://www.idris-lang.org/
 /___/\__,_/_/  /_/____/       Type :? for help

Idris is free software with ABSOLUTELY NO WARRANTY.
For details type :warranty.
*function> hello "Nancy"
"Hello: Nancy" : String
*function>
```

## Exporting the Function to JavaScript

This is great, but we need a way to run this code on Google Cloud Functions. Fortunately, Idris provides a built-in compiler to JavaScript, so we can compile our Idris function above into JavaScript code, which Google Cloud Functions directly supports. However, we still need a way to access the incomming HTTP request object, and write a string to the response. Since both the request and response are actual JavaScript objects, the most convenient thing to do is write some wrapper JavaScript which calls our `hello` function. 

But to do this we need to make sure that JavaScript code can call our `hello` function. To do this we just need to add an `FFI_Export` declaration to the Idris code:

```idris
module MyFunction

export -- This is new
hello : String -> String
hello req = "Hello: " ++ req

-- This is all new
lib : FFI_Export FFI_JS "" []
lib =
    Fun hello "hello" $
    End
```

At this point it's a good idea to test that the compilation and exporting to JavaScript actually works. In your terminal first compile the function to JavaScript:

```bash
idris --codegen node --interface function.idr -o function.js
```

The `--codegen node` options tells Idris to compile it to JavaScript rather than a binary, and the `--interface` options tells Idris to create a node module with exports rather than a standalone executable script. If this compiles without problems, you can try loading the result in node and calling your `hello` function from JavaScript. Assuming you have `node` installed, you can try:

```bash
$ node
> f = require('./function.js')
{ hello: [Function: MyFunction__hello] }
> f.hello("Larry")
'Hello: Larry'
>
```

## Putting the Pieces Together

At this point we have a function written in Idris, which we can call from JavaScript. All that we need to do is write a simple JavaScript wrapper which will be the main entry point of the serverless function, and which will call the Idris `hello` function. Make a new file `index.js` with this code:

```js
const f = require('./function.js');

exports.gcf_main = function gcf_main(req, res) {
    res.send(f.hello(req.body));
}
```

This code first loads `function.js` which is the compiled version of our Idris code `function.idr`, and then defines `gcf_main` which is the main entry point of our serverless function. All this does is extract the HTTP request body as a string, call the `hello` function, and send the result in the HTTP response body. There should probably be some checking for existence and content type of the body, but this suffices for a demo example.

This is all the code we need to write! You can deploy this to Google Cloud Functions with the command:
```bash
gcloud functions deploy my-function-name --entry-point gcf_main --runtime nodejs6 --trigger-http
```

You can put whatever you want for `my-function-name`.

Once it finishes deploying it should report an `httpsTrigger` URL, something like:
```
httpsTrigger:
  url: https://MY-DOMAIN.cloudfunctions.net/my-function-name
```

At this point you can send an actual HTTP request and get a response by using `curl`:
```bash
$ curl -X POST https://MY-DOMAIN.cloudfunctions.net/my-function-name -H "Content-Type:text/plain"  -d 'Suzie'
Hello: Suzie
```

This shows that our compiled Idris code was actually successfully executed on Google's servers. Pretty cool!

# What's Next

While easy to setup, the approach here does have a few problems. Most importantly, the Idris function doesn't have very much control over accessing the HTTP request and response. For example, the Idris function has no way to return an HTTP status code other than 200, nor does it have a way to return content types other than plain text. In addition, the Idris function can't branch on different request content types or other HTTP headers.

To improve this we can try and put more logic into the JavaScript code wrapper. However, the purpose of using Idris is to be able to verify correctness of our code, so the more code we move into the JavaScript, the more code we aren't able to prove correctness of. A different approach is to write everything in Idris, discard the JavaScript wrapper, and use Idris's JavaScript FFI to access the request and response objects directly. This approach is a lot more involved to setup, and unfortunately [currently triggers a bug in the compiler](https://github.com/idris-lang/Idris-dev/issues/4656). However, as this bug is worked out and libraries are developed to make accessing the request and response objects more convenient, I think this approach will become more promising.

At the present, Idris provides a convenient way to write serverless functions in a dependently-typed language, giving you the ability to prove correctness of critical business logic. If you need to do a lot of manipulation of HTTP request and response objects then Idris might not be quite ready yet, but hopefully will be down the road. If you are a lighter user of HTTP APIs, then I suggest giving Idris a try, it's quite fun!