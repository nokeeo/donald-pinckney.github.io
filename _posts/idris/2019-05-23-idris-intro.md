---
layout: post
title: "An Interactive Introduction to Dependent Types with Idris"
categories: Idris
date: 2019-05-23
isEditable: false
runOrEdit: true
---

# What are Dependent Types?

Type theory and programming languages research in recent decades has produced this incredibly interesting extension to ordinary types in programming languages called **dependent types**. Roughly speaking, dependent types let you *mathematically prove complex properties about your code*, and on top of that the computer will check that your proof is indeed correct. But the power of dependent types don't stop there: in addition to proving things about programs, dependent types also let you write fully-verified proofs about general mathematics. For example, in 2005 dependent types were used to formally prove the famous Four-Color Theorem[^4color]. While there are several systems available for programming with dependent types, I want to introduce readers to dependent types in [Idris](https://www.idris-lang.org), as Idris offers theorem proving abilities via dependent types while also being a fairly nice language for writing programs, all while being quite accessible to learn.


[^4color]: [https://www.ams.org/notices/200811/tx081101382p.pdf](https://www.ams.org/notices/200811/tx081101382p.pdf)
