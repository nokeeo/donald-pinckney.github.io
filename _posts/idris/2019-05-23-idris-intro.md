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

Idris is based strongly on Haskell, so learning Idris will also involve learning functional programming, if that is new to you. However, many of the topics that have accrued a reputation of being difficult to learn in Haskell (such as [monads](https://wiki.haskell.org/Monad_tutorials_timeline)) are fairly orthogonal to the basics of functional programming and dependent types. If you have no experience with Haskell, I would highly recommend giving Idris a try: you might be pleasantly surprised.

# Functional Programming by Example: Binary Search Trees

I don't want to introduce Idris by talking about the theory of dependent types, rather I want to show it via demonstration by developing a simple binary tree insertion algorithm.

## Representing a Binary Search Tree

First we need a way to represent a binary (search) tree. Recall that in a binary tree each node of the tree contains a value (say a natural number), and possible contains left and / or right subtrees. We can represent this in Idris as the following type:

```idris,editable,path=BST.idr,slice=0
module BST

-- This defines a new type called BinaryTree, with 2 constructors Empty and HasValue.
-- Empty takes no arguments, HasValue takes 3 arguments.
data BinaryTree = Empty | HasValue Nat BinaryTree BinaryTree
```

Concretely, this says that a binary tree takes exactly 2 forms:

1. It is just `Empty` (no tree), 
2. Or it contains a value (a natural number, or `Nat`) at the root node, and has a left and right subtree. 

In fact, `Empty` and `HasValue` are called **data constructors**, meaning that they are functions which let you construct `BinaryTree` values. We can see this interactively by putting our cursor on `HasValue` in the above code, and hitting **Ctrl-Alt-T**. The result tells you that `HasValue` is a function which takes as input one `Nat` and 2 `BinaryTree`s and returns a new `BinaryTree`. Similarly, inspecting the type of `Empty` tells you that it simply returns a `BinaryTree` given no arguments.

As an example, we can use `Empty` and `HasValue` to build binary trees like so:

```idris,editable,path=BST.idr,slice=1
-- First we declare the type of tree1
tree1 : BinaryTree
tree1 = HasValue 5 (HasValue 3 Empty Empty) (HasValue 8 Empty (HasValue 10 Empty Empty))
-- and then we can define the value of it

{-
tree1 corresponds to this tree:

    5
   / \
  3   8
       \
        10
-}
```

To explain some syntax, first `tree1 : BinaryTree` declares that `tree1` will have *type* `BinaryTree`, and then the following line gives the definition of the *value* of `tree1`. Also note that in Idris functions (such as `HasValue`) are called without parentheses and commas such as in many popular languages, but that we do need to use parentheses to indicate grouping of arguments. That is, `(HasValue 3 Empty Empty)` is the entire 2nd argument to the outermost `HasValue` call. Finally, note that `tree1` is not a *variable*, as it is not possible to modify the value of it later. To check your understanding, complete this exercise:

```idris,editable,path=BST.idr,slice=2
{-
Exercise: Define tree2 such that it corresponds to this tree:

     9
    / \
  4     34
 / \    / \
3   6  20  40

You can hit Ctrl-Alt-R at any time to run the typechecker 
to ensure you call HasValue and Empty with arguments of the correct type.
-}

tree2 : BinaryTree
tree2 = ?tree2_ex
```

## Binary Search Tree Insertion

Great, now that we have a way to represent binary trees in Idris we can get our hands dirty writing a binary tree insertion function. Above we declared `tree1` and `tree2` to be values of type `BinaryTree`. To declare a function in Idris we do the same thing: we declare a value called `insert` of type `BinaryTree -> Nat -> BinaryTree`, that is a function which takes as input a binary tree, a natural number to insert, and returns the updated binary tree. Lastly, to define the value of `insert` we can write the arguments on the left hand side of the `=` and the body of the function on the right hand side:

```idris,editable,path=BST.idr,slice=3
insert : BinaryTree -> Nat -> BinaryTree
insert tree n = ?insert_hole
```

Before we actually write the body of the function, let's take stock of where we are at. On the left of the `=` we have our 2 arguments `tree` and `n`, and on the right side we have `?insert_hole`, which is a **hole** standing in place of the implementation of `insert`. You should try inspecting the type of `?insert_hole` by putting your cursor over it in the above code, and hitting **Ctrl-Alt-T**. This tells you that in this context, `tree` has type `BinaryTree` and `n` has type `Nat`, and our goal (of the hole) is to produce something of type `BinaryTree`.




[^4color]: [https://www.ams.org/notices/200811/tx081101382p.pdf](https://www.ams.org/notices/200811/tx081101382p.pdf)
