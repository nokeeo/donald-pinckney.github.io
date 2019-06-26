---
layout: post
title: "An Interactive Introduction to Dependent Types with Idris"
categories: Idris
date: 2019-06-25
isEditable: false
runOrEdit: true
---

<link rel="stylesheet" href="/public/css/theorems.css">

# What are Dependent Types?

Type theory and programming languages research in recent decades has produced this incredibly interesting extension to ordinary types in programming languages called **dependent types**. Roughly speaking, dependent types let you *mathematically prove complex properties about your code*, and on top of that the computer will check that your proof is indeed correct. But the power of dependent types doesn't stop there: in addition to proving things about programs, dependent types also let you write fully-verified proofs about general mathematics. For example, in 2005 dependent types were used to formally prove the famous Four-Color Theorem[^4color]. While there are several systems available for programming with dependent types, I want to introduce dependent types in [Idris](https://www.idris-lang.org), as Idris offers theorem proving abilities via dependent types while also being a fairly nice language for writing programs, all while being quite accessible to learn.

Idris is based strongly on Haskell, so learning Idris will also involve learning functional programming, if that is new to you. However, many of the topics that have accrued a reputation of being difficult to learn in Haskell (such as [monads](https://wiki.haskell.org/Monad_tutorials_timeline)) are fairly orthogonal to the basics of functional programming and dependent types. If you have no experience with Haskell, I would highly recommend giving Idris a try: you might be pleasantly surprised, as I was.

# How to Interact with This Post

Most of the code for this post will actually be written by you, rather than just shown to you. The code blocks in this post are a fully interactive editor, including support for Idris. If you are just curious about Idris then *you don't need to install anything at all for this post, you can just edit directly in the code blocks here*. If you prefer to install Idris locally you can of course follow along by coding in the text editor of your choice (Idris has good plugins for Atom, Vim and Emacs). 

# Idris in Action: Implementing One Time Pad (OTP) Encryption

Dependent types have a deep history and metatheory behind them, but I don't want to talk about that, rather I want to introduce functional programming and dependent types via a fairly simple application: implementing the One Time Pad (OTP) encryption scheme. If OTP is new to you, don't worry, it's pretty simple. We will work entirely with strings of bits. Suppose Alice and Bob both know a secret key \\(K\\), and Alice wants to send a message \\(M\\) to Bob, such that if the message is intercepted, it can not be read.

Alice does this by encrypting \\(M\\) by computing the so-called cipher text to be: \\(C = M \oplus K\\), that is, Alice takes each bit of \\(M\\) and XORs it with each bit of \\(K\\). Then Alice transmits this cipher text to Bob. When Bob receives the cipher text \\(C\\) he decrypts it by XORing again with the key: \\(C \oplus K = (M \oplus K) \oplus K = M\\):

\\[
    Alice \xrightarrow{\;\;\;C = M \oplus K\;\;\;} Bob, \textrm{ decrypts by computing  } (M \oplus K) \oplus K = M
\\]

## Defining Bits and XOR in Idris via Interactive Editing

First, let's start with basic stuff: defining what bits even are, and how to compute XOR. We start a new Idris file `OTP.idr`, and define `Bit`:

```idris,editable,path=OTP.idr,slice=0
module OTP

data Bit : Type where
    ZeroBit : Bit
    OneBit : Bit
```

The `data` syntax is used to define a new **type**, in this case we call the new type `Bit`. After the `where` keyword we define the **data constructors**, which are the (only) ways in which a `Bit` can be created: a `Bit` can either be `ZeroBit` or `OneBit`. `Bit` is very much like an enumeration type in other languages, such as C or Java. 

Next let's try to define the XOR operation on bits. We define XOR as a function: it takes as input 2 Bits, and returns a Bit as output. Thus, we say that the XOR operation has the type `Bit -> Bit -> Bit`. We can write it down like so:

```idris,editable,path=OTP.idr,slice=1
xor : Bit -> Bit -> Bit
```

Now we need to actually write the code that implements the `xor` function. We can have Idris create the body of the function for us by putting the cursor on `xor` above, and hitting `Ctrl-Alt-a`. You should see code appear which looks like `xor x y = ?xor_rhs`. This says that when the `xor` function is applied to arguments `x` and `y` (arbitrary Bits), then the value `?xor_rhs` is returned. The syntax `?xor_rhs` is called a **hole**: it stands in place for something that you still need to write. We can **inspect** this hole by putting the cursor on the hole, and hitting `Ctrl-Alt-t`. Idris shows us the variables `x` and `y` with type `Bit` above the line, and shows the hole below the line, with type `Bit` as well. This means that in the context of having variables `x` and `y` of type `Bit`, to fill in the hole `?xor_rhs` we need to produce something of type `Bit`.

The Bit we want to return depends on what `x` and `y` are exactly. In most programming languages you would now use an if statement to test if `x` is `ZeroBit` or `OneBit`, etc. While Idris does have if statements, a much more powerful way to proceed is with **case splitting**. Put your cursor on the `x` and hit `Ctrl-Alt-c`, and you should see Idris split the equation into 2 cases, one for when `x` is `ZeroBit` and one for when `x` is `OneBit`. For each of these cases `y` is still arbitrary, so repeat by case splitting on `y` twice (once on each of the `x` cases).

At this point you should see 4 different cases, each of which look like `xor ZeroBit ZeroBit = ?xor_rhs_3` (for example). You can now complete the `xor` function by filling in the right hand side for each of the cases. For example, for this first case you should write `xor ZeroBit ZeroBit = ZeroBit`. Continue completing all the other cases.

## Defining a Bit Vector

Now that we have a basic Bit type and `xor` function implemented, let's move on to dealing with **bit vectors**, since ultimately we will want to do encryption over **bit vectors**, not just single bits. In most programming languages we could define an array or list of Bits, and then have a type such as `BitList`. But in Idris we can do something much more interesting, we can include the length of the bit vector in the type. In this case we would have many (infinitely many) distinct types, such as `BitVector 0`, `BitVector 1`, `BitVector 42`, etc. This is called a **family of types**, indexed by natural numbers. We can define such a BitVector like so:

```idris,editable,path=OTP.idr,slice=2
data BitVector : Nat -> Type where
    Nil : BitVector Z
    Cons : Bit -> BitVector n -> BitVector (S n)
%name BitVector xs, ys -- This is unimportant, just gives Idris hints for automatically making variable names.
```

There is a lot going on here, so let's break it down. First, note that `BitVector` is defined as `Nat -> Type`, that is, given a natural number such as `42`, a type is returned, namely the type `BitVector 42`. For the data constructors, we have 2, named `Nil` and `Cons`. What `Nil` represents is the empty list, i.e. the BitVector of length zero. Thus, `Nil` takes no arguments, and has type `BitVector Z` (`Z` is zero for natural numbers in Idris). Now, `Cons` is a bit more tricky. `Cons` represents taking a new `Bit` and attaching it to the front of an existing bit vector. When we do this we get a new bit vector whose length is one greater. Thus, `Cons` takes 2 arguments, a `Bit` and a bit vector of length `n`, for any arbitrary natural number `n`. The result of `Cons` is a bit vector of length `S n`, since `S n` is used to represent the natural number that is one greater than `n` (`Nat`, `Z` and `S` all come from the Idris standard library).

This may be all a bit abstract, so let's look at some examples to see why the definition above actually is a list. We can just define some constants of various `BitVector` types:

```idris,editable,path=OTP.idr,slice=3
-- this represents the empty bit vector
emptyBitVect : BitVector Z
emptyBitVect = Nil


-- this represents the bits 101
aBitVect : BitVector 3
aBitVect = Cons OneBit (Cons ZeroBit (Cons OneBit Nil))

-- this represents the bits 110
anotherBitVect : BitVector 3
anotherBitVect = Cons OneBit (Cons OneBit (Cons ZeroBit Nil))
```

Another way to put this is that the data of the bit vector is encoded in the structure of the expression, with the length of the list being the same as the number of nested `Cons`.

Note that in term of programming, dependent types give us greater type safety compared to types in other statically typed languages, such as Java, Haskell, etc. as we can encode constraints such as lengths of lists in the types. For example, in the above definition you can change the declaration of `anotherBitVect` to have the type `BitVector 4` for example (but leave the definition as is), and then if you type-check the code by hitting `Ctrl-Alt-r`, Idris will report that the types do not match. Make sure you change it back before continuing.

## Defining Bitwise XOR and the OTP

At this point we have bit vectors defined as well as the XOR operation on single bits. We now want to define a *bitwise* XOR operation, that is, we want to define a function `bitwiseXor` which given 2 bit vectors `xs` and `ys` computes a new bit vector which consists of each bit of `xs` XORed with each corresponding bit of `ys`. For example, we would expect `bitwiseXor aBitVect anotherBitVect = Cons ZeroBit (Cons OneBit (Cons OneBit Nil))`. 

Let's first discuss what the type of `bitwiseXor` should be. In a typical programming language such as Java you would write `bitwiseXor` to take as input 2 arrays of bits, and return a new array, such as `Bit[] bitwiseXor(Bit[] xs, Bit[] ys) { ... }`. But then you would have to include a guard to check that they have the same lengths, eg.:

```java
Bit[] bitwiseXor(Bit[] xs, Bit[] ys) { 
    if(xs.length != ys.length) {
        // return null, or throw exception, etc.
    }
    // ...
```

In the error case you need to do something rather untasteful such as returning null or throwing an exception, which code that calls this function would need to handle. Or, possibly you would forget to include the guard, potentially leading to bugs down the road. In either case, the original sin is calling `bitwiseXor` with differently sized lists, this should be invalid to do. Idris allows us to specify precisely this using **dependent function types**. Let's take a look at the type of `bitwiseXor`:

```idris,editable,path=OTP.idr,slice=4
bitwiseXor : (n : Nat) -> BitVector n -> BitVector n -> BitVector n
```

First, we add an additional `Nat` parameter to the front of the function. However, we can actually give the *name* `n` to this `Nat`. The key is that later parameters can refer to `n` in their types. We see exactly that: `bitwiseXor` then takes as parameters 2 bit vectors each of length `n`, and returns a new bit vector of the same length `n`. Since the 2 bit vector parameters refer to the same `n` in their types, it is impossible to call the function with bit vectors of equal length.

Now we need to define `bitwiseXor`. As before start by putting your cursor on `bitwiseXor` and hitting `Ctrl-Alt-a`. Now there are 2 ways that a bit vector can be constructed, using either `Nil` or `Cons ...`. Thus, `xs` (and `ys`) should have 2 cases to consider. Case split (`Ctrl-alt-c`) on both `xs` and `ys`. You should end up with the following 2 cases:

```idris,editable,path=OTP.idr,slice=5
bitwiseXor Z [] [] = ?bitwiseXor_rhs_3
bitwiseXor (S k) (Cons x xs) (Cons y ys) = ?bitwiseXor_rhs_1
```

Note that this is different than what we might have expected. First, Idris automatically case split `n` when you case split `xs` (or `ys`). This is because of the dependent types above: if `xs` is `[]` (Idris uses `[]` and `Nil` interchangeably), then since `xs` has type `BitVector n` it must be that `n` is `Z`. Similarly, if `xs` is `Cons x xs` (the inner `xs` is a new bit vector with the same name, which unfortunately is a bit confusing) then it must be that the length is non-zero, i.e. the length must be of the form `S k`. Furthermore, Idris also dealt with the relationship between `xs` and `ys`: a priori one might expect there to be additional cases to consider, such as when `xs = []` and `ys = Cons y ys`, but Idris rules this out because the lengths must be equal.

Finally we just need to fill in the holes. For the first hole, the two input bit vectors are both the empty bit vector, and you want to return an empty bit vector. So all you need to put there is `Nil` (or `[]`, same thing).  The 2nd case is more interesting and worth investigating. Inspect the hole (using `Ctrl-Alt-t`). This tells you that `x` and `y` are both `Bit`, and that the smaller sub-bit-vectors `xs` and `ys` have length `k`. Our goal is to produce a bit vector of length `S k`. We can produce a bit vector of length `S k`, by using `Cons` (as can be read from the type of `Cons` above). Try replacing the hole with `Cons ?head_hole ?tail_hole`, which now has 2 holes, one for each argument to `Cons`. Then, you can verify that this type-checks with `Ctrl-Alt-r` which means using `Cons` here is the right thing, we just need to fill in stuff for the holes.

The first hole is easier so we wil start with this. The situation is we have 2 bit vectors of the form \\([x, \cdots xs \cdots]\\) and \\([y, \cdots ys \cdots]\\), and we want to compute the bitwise XOR. So our new bit vector should certainly have the form \\([xor\;x\;y, \cdots zs \cdots]\\). Thus we want `xor x y` for the `?head_hole`. For the `?tail_hole`, we can note that `xs` and `ys` are both bit vectors of the same length `k`, just one smaller than the original bit vectors. Thus, `bitwiseXor k xs ys` will be the bitwise XOR of `xs` and `ys`, so when combined with the answer for `?head_hole` it gives the desired solution. The final expression that you need to fill in for this case is thus `Cons (xor x y) (bitwiseXor k xs ys)`. If this style of functional programming recursion is new to you, this might not be totally natural. It can help to manually trace the execution of this function on example inputs such as on `aBitVect` and `anotherBitVect`.

Finally, we can use `bitwiseXor` to very easily give definitions of the One Time Pad encryption / decryption:

```idris,editable,path=OTP.idr,slice=6
otpEncrypt : (n : Nat) -> (message : BitVector n) -> (key : BitVector n) -> BitVector n
otpEncrypt n message key = bitwiseXor n message key

otpDecrypt : (n : Nat) -> (cipherText : BitVector n) -> (key : BitVector n) -> BitVector n
otpDecrypt n cipherText key = bitwiseXor n cipherText key
```

Note that here I have named the parameters `message`, `key`, etc. even though they are not used in dependent types. This is perfectly fine and does nothing special, it can just be nice to have as a sort of documentation. However, you can't name the return type. Also, note that the encryption and decryption routines are actually the same, but for clarify it is nice to keep them separate (and it wouldn't be true with other ciphers).

## Proofs Using Dependent Types

I started this post by remarking that dependent types are powerful enough to encode much (most, all??) of mathematics, and I hope to give a hint of that here. So far we have an implementation of the OTP cipher. However it is plausible that we could have a bug in our implementation. As a sanity check for out implementation, it should be the case that decrypting and encrypted message gives back the original message. Written as a mathematical theorem:

<div class="theorem">
    For all natural numbers \(n\) and all bit vector messages \(m\) and keys \(k\) of length \(n\),
    \[
        otpDecrypt \; n \; (otpDecrypt \; n \; m \; k) \; k = m
    \]
</div>

### Propositions as Types

Using dependent function types in Idris we can *encode this theorem as a type*. To see how, we have to understand how to encode the equality in the above theorem. The equality above is very different from the equality when we define functions. For instance, the function definition `xor ZeroBit ZeroBit = ZeroBit` means that `xor ZeroBit ZeroBit`*by definition* is the same as `ZeroBit`. This kind of equality is called **definitional equality**. However, the equality in the above theorem might or might not actually be true, thus we regard it as a **proposition**, a potential fact yet to be proven. For instance, if we have a bug in our above code, this proposition might not be true. This kind of equality is called **propositional equality**.

In Idris we represent propositions as types, and we prove that a proposition is true by showing that there exists something of the type representing it. Such an element of the type is called **evidence**. Idris has a built-in type which represents **propositional equality**. Suppose `a` and `b` are both elements of the same type. Then `a = b` is a type representing the proposition that `a` and `b` are in fact equal. The only immediate way to create evidence of the propositional equality type is through the data constructor `Refl : a = a`, which produces an element of the type `a = a`. To make things more concrete, let's look at some examples:

1. `4 = 4` is a type, and `Refl : 4 = 4` is an element of that type (i.e. `Refl` is evidence of `4 = 4`).
2. `5 = 5` is a different type from `4 = 4`. We can again use `Refl : 5 = 5` to get evidence of it.
3. `4 = 5` is yet another type. Note that `4 = 5` is a perfectly valid type, but we can't use `Refl` to get evidence. We expect that it should be impossible to construct evidence of this type since it represents a false proposition.
4. Suppose `n` and `m` are `Nat`s. Then `n + m = m + n` is a type. But since `n + m` and `m + n` aren't definitionally equal we can't immediately use `Refl` to construct evidence. Additional effort is needed since it is a more involved fact about addition.

So in this case we have that if `n` is a `Nat`, and `m` and `k` both are of type `BitVector n` then `otpDecrypt n (otpEncrypt n m k) k = m` is a valid type representing the equality we want to prove. While we aren't quite ready to *prove* the above theorem, using the techniques just discussed we can at least give a statement of the theorem:

```idris,editable,path=OTP.idr,slice=7
total otpCorrect_TMP : (n : Nat) -> (m : BitVector n) -> (k : BitVector n) -> otpDecrypt n (otpEncrypt n m k) k = m
```

Intuitively, what the above function declaration says is that given an `n`, `m`, and `k` (of appropriate length), the function will return evidence that the desired equation is true. Giving an implementation of this function is equivalent to giving a proof of the theorem. We can't quite prove it yet, and when we do so we will state it again, hence the `_TMP` name. Finally, note that I marked it as `total`: this means that Idris will check (at type-checking time) that the function will always execute in finite time. This is necessary to enforce valid mathematical proofs.

### A Warm-Up Theorem

First, I want to start by proving a smaller helper theorem (called a lemma in the parlance of mathematicians) which has the dual purpose of serving as an easier warm-up and being a building block for the main proof. The lemma is really the essence of what the main theorem boils down to, that XOR-ing twice gets you nothing. That is, we want to prove the following lemma:

```idris,editable,path=OTP.idr,slice=8
total xorCancel : (x : Bit) -> (y : Bit) -> xor (xor x y) y = x
```

Start by putting your cursor on `xorCancel` and hitting `Ctrl-Alt-a`, and then inspecting the type of the hole with `Ctrl-Alt-t`. Previously this showed us the current variables in scope, and what type we want to try to return. We now regard it as showing us what fact we want to prove. Right now it says that if `x` and `y` are `Bit`s then we want to prove `xor (xor x y) y = x`. We call this our **proof goal**. We don't have much to go on here, so try case splitting on `x` (`Ctrl-Alt-c`) and then inspecting the hole for the `ZeroBit` case. Now we can see that the proof goal has been updated to `xor (xor ZeroBit y) y = ZeroBit` (and `x` has been deleted from the context). This seems more concrete, but we sill can't yet prove it. Case split on `y`, and then inspect the hole for the `ZeroBit ZeroBit` case. Finally we see an easy proof goal: `ZeroBit = ZeroBit`. We can fill in the hole by simply putting `Refl`.

Why exactly did we got this proof goal? When we case split on both `x` and `y` (say in the `ZeroBit ZeroBit` case) we essentially substitute `ZeroBit` for both `x` and `y` in the goal. That is, the goal became `xor (xor ZeroBit ZeroBit) ZeroBit = ZeroBit`. However, `xor ZeroBit ZeroBit` corresponds directly to one of the definitional equality rules that we gave when we defined the `xor` function. Idris then automatically evaluates the inner function call to turn `xor (xor ZeroBit ZeroBit) ZeroBit` into `xor ZeroBit ZeroBit`, and then this turns into `ZeroBit`. Thus, we end up with the proof goal of `ZeroBit = ZeroBit`. In the cases of `x` and `y` being arbitrary bits Idris is not able to perform the simplification automatically.

If you inspect the holes of other cases you should see similar contexts and goals as for the `ZeroBit ZeroBit` case. Use `Refl` to complete these cases on your own. You can check that your proof is correct by type-checking with `Ctrl-Alt-r`.

## The Main Proof

We now want to implement / prove the function `otpCorrect : (n : Nat) -> (msg : BitVector n) -> (ky : BitVector n) -> otpDecrypt n (otpEncrypt n msg ky) ky = msg`.

The first thing to note is that by nature this is more difficult than the warm-up lemma. In the lemma we proved things about 2 bits, and since there are only finitely many (4) cases we can just explicitly cover all the cases. But for this theorem there are an infinite number of possible bit vectors, so we can not use quite the same strategy. However, the key in the previous lemma was not to case split all possible cases, rather the key was to case split sufficiently until Idris could directly apply the definitional equality rules of the `xor` function. If we look at the definition of `bitwiseXor` (which is essentially the same as `otpEncrypt` / `otpDecrypt`) we see that it has 2 definitional equality rules: both bit vectors are `[]` or both bit vectors in the `Cons` form. The crucial insight is that in the case of `Cons x xs` we don't know much about `xs`, but the 2nd definitional equality rule of `bitwiseXor` still applies to be able to do some (partial) evaluation. Let's see this in action.

```idris,editable,path=OTP.idr,slice=9
total
otpCorrect : (n : Nat) -> (msg : BitVector n) -> (ky : BitVector n) -> otpDecrypt n (otpEncrypt n msg ky) ky = msg
```

As usual you can start the proof with `Ctrl-Alt-a` and then inspecting the holes. You will see the context and proof goal pretty much directly copied from the function declaration.

Case split on both `msg` and `ky` to get 2 cases. In the `Cons` case you might want to use variable names that better match the original names, such as `otpCorrect (S n) (Cons m ms) (Cons k ks) = ...`. From here on I'll refer to these variable names. First, you can start with the easy case and inspect the hole of the `[] []` case. In this case Idris knows that `otpEncrypt` / `otpDecrypt` applied to the empty bit vector returns the empty bit vector, so we have a proof goal of `[] = []`. You can fill in the hole with `Refl`.

Now inspect the double `Cons` case. This tells us that we have proof goal of `Cons (xor (xor m k) k) (bitwiseXor n (bitwiseXor n ms ks) ks) = Cons m ms`. Since the goal has a `Cons` at the top of both the left and right hand sides of the goal, we should try to prove that `(xor (xor m k) k) = m` and that `bitwiseXor n (bitwiseXor n ms ks) ks = ms`. The first one should be true because of the `xorCancel` lemma that we proved above. Let's call that function / lemma to get the evidence we need and save it in a local variable. The syntax for doing so looks like so:

```haskell,norun
otpCorrect (S n) (Cons m ms) (Cons k ks) = 
    let xor_eq = xorCancel m k in
    ?otpCorrect_rhs_3
```

Put a similar local variable into your code, and then inspect the hole again. The goal is the same, but now we have `xor_eq : xor (xor m k) k = m` in the context. We can now use this to **rewrite** the proof goal using this syntax:

```haskell,norun
otpCorrect (S n) (Cons m ms) (Cons k ks) =
    let xor_eq = xorCancel m k in
    rewrite xor_eq in
    ?otpCorrect_rhs_3
```

If you put that into your code and then inspect the hole, you will see a simplified proof goal in which `xor (xor m k) k` has been rewritten to just `m`. In other words, we proved that the first arguments to `Cons` are equal, so now we just need to show that `bitwiseXor n (bitwiseXor n ms ks) ks = ms`. But this is exactly the theorem we are trying to prove (except for renaming of `bitwiseXor` with `otpEncrypt` / `otpDecrypt`), but on the smaller sub-lists of `ms` / `ks`! Thus, we can use recursion to obtain the evidence we need. Like above, bind to a local variable the value of `otpCorrect n ms ks`, inspect the hole to make sure you got the right thing, and then use it to rewrite the goal. If all goes well you should end up with a goal of `Cons m ms = Cons m ms`. At this point you can complete the proof by using `Refl` in place of the hole! Lastly, you can check that your proof is correct by type-checking with `Ctrl-Alt-r`.

> If you are familiar with writing traditional mathematical proofs using induction, that is precisely what we did above using recursion. There is a relationship between recursion for programming and induction for proofs.

# Conclusions

Congratulations! You have written some pretty interesting Idris code to implement OTP encryption, and proved a simple but fundamental and necessary theorem about OTP that the decryption and encryption are inverses. Because of this proof, we know that there is no bug in the OTP implementation that can cause a cipher text to not be properly decrypted. That being said, we haven't proved that our OTP implementation is actually bug free in general: it *could* for example just be the identity function which performs no encryption. In that case our theorem would still hold, since the bug would instead violate the property that the OTP is actually secure. So then we could take another step and formalize what it means for an encryption algorithm to be secure and prove that property about the OTP implementation. Whether or not that is a worthwhile time investment is a another question, dependent on your aims. This is a repeating pattern of using dependent types in practice: it can be tricky to identify properties which are both important and relatively easy to specify and prove (such as `otpCorrect`), but taking the opportunity to do so can be really fun and rewarding.

# Complete Code

The [complete code is available on GitHub](https://github.com/donald-pinckney/donald-pinckney.github.io/blob/src/public/post_assets/idris/idris-intro/OTP.idr), as well as directly here:

```idris,editable,path=OTP_sol.idr,slice=0
module OTP

data Bit : Type where
    ZeroBit : Bit
    OneBit : Bit

xor : Bit -> Bit -> Bit
xor ZeroBit ZeroBit = ZeroBit
xor ZeroBit OneBit = OneBit
xor OneBit ZeroBit = OneBit
xor OneBit OneBit = ZeroBit

data BitVector : Nat -> Type where
    Nil : BitVector Z
    Cons : Bit -> BitVector n -> BitVector (S n)
%name BitVector xs, ys -- This is unimportant, just gives Idris hints for automatically making variable names.

-- this represents the empty bit vector
emptyBitVect : BitVector Z
emptyBitVect = Nil


-- this represents the bits 101
aBitVect : BitVector 3
aBitVect = Cons OneBit (Cons ZeroBit (Cons OneBit Nil))

-- this represents the bits 110
anotherBitVect : BitVector 3
anotherBitVect = Cons OneBit (Cons OneBit (Cons ZeroBit Nil))


bitwiseXor : (n : Nat) -> BitVector n -> BitVector n -> BitVector n
bitwiseXor Z [] [] = []
bitwiseXor (S k) (Cons x xs) (Cons y ys) = Cons (xor x y) (bitwiseXor k xs ys)

otpEncrypt : (n : Nat) -> (message : BitVector n) -> (key : BitVector n) -> BitVector n
otpEncrypt n message key = bitwiseXor n message key

otpDecrypt : (n : Nat) -> (cipherText : BitVector n) -> (key : BitVector n) -> BitVector n
otpDecrypt n cipherText key = bitwiseXor n cipherText key




total xorCancel : (x : Bit) -> (y : Bit) -> xor (xor x y) y = x
xorCancel ZeroBit ZeroBit = Refl
xorCancel ZeroBit OneBit = Refl
xorCancel OneBit ZeroBit = Refl
xorCancel OneBit OneBit = Refl

total
otpCorrect : (n : Nat) -> (msg : BitVector n) -> (ky : BitVector n) -> otpDecrypt n (otpEncrypt n msg ky) ky = msg
otpCorrect Z [] [] = Refl
otpCorrect (S n) (Cons m ms) (Cons k ks) =
    let xor_eq = xorCancel m k in
    rewrite xor_eq in
    let ih = otpCorrect n ms ks in
    rewrite ih in
    Refl

```

[^4color]: [https://www.ams.org/notices/200811/tx081101382p.pdf](https://www.ams.org/notices/200811/tx081101382p.pdf)
