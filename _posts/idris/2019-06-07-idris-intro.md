---
layout: post
title: "An Interactive Introduction to Dependent Types with Idris"
categories: Idris
date: 2019-06-07
isEditable: false
runOrEdit: true
---

# What are Dependent Types?

Type theory and programming languages research in recent decades has produced this incredibly interesting extension to ordinary types in programming languages called **dependent types**. Roughly speaking, dependent types let you *mathematically prove complex properties about your code*, and on top of that the computer will check that your proof is indeed correct. But the power of dependent types doesn't stop there: in addition to proving things about programs, dependent types also let you write fully-verified proofs about general mathematics. For example, in 2005 dependent types were used to formally prove the famous Four-Color Theorem[^4color]. While there are several systems available for programming with dependent types, I want to introduce dependent types in [Idris](https://www.idris-lang.org), as Idris offers theorem proving abilities via dependent types while also being a fairly nice language for writing programs, all while being quite accessible to learn.

Idris is based strongly on Haskell, so learning Idris will also involve learning functional programming, if that is new to you. However, many of the topics that have accrued a reputation of being difficult to learn in Haskell (such as [monads](https://wiki.haskell.org/Monad_tutorials_timeline)) are fairly orthogonal to the basics of functional programming and dependent types. If you have no experience with Haskell, I would highly recommend giving Idris a try: you might be pleasantly surprised.

# Idris in Action: Implementing One Time Pad (OTP) Encryption

Dependent types have a deep history and metatheory behind them, but I don't want to talk about that, rather I want to introduce functional programming and dependent types via a fairly simple application: implementing the One Time Pad (OTP) encryption scheme. If OTP is new to you, don't worry, it's pretty simple. We will work entirely with strings of bits. Suppose Alice and Bob both know a secret key \\(K\\), and Alice wants to send a message \\(M\\) to Bob that nobody else can read. Alice does this by encrypting \\(M\\) by computing the so-called cipher text to be: \\(C = M \oplus K\\), that is, Alice takes each bit of \\(M\\) and XORs it with each bit of \\(K\\). If we receive an 


[^4color]: [https://www.ams.org/notices/200811/tx081101382p.pdf](https://www.ams.org/notices/200811/tx081101382p.pdf)
