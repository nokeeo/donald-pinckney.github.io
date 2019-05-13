# Testing!

Hello world!

This is a code block for python:

```python
print("hello")
```

This is a code block for idris!:

```idris,editable,path=proofs/naturals.idr,slice=2
module Naturals.PNat

%access public export
%default total
||| PNat is a positive natural number (one or greater). The definition is
||| the same as that of Nat.
data PNat : Type where
  ||| One
  O : PNat
  ||| Successor
  N : PNat -> PNat

%name PNat i, j, k, m, n

||| We always have x' != 1
axiom3 : (x : PNat) -> (N x) = O -> Void
axiom3 _ Refl impossible

axiom4 : Nat -> Nat
axiom4 x = if True then x else x
```

And for rust:

<!-- ```rust
fn main() {
    let number = 5;
    print!("{}", number);
}
``` -->

Rust editable:

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

<!-- ```rust,editable
fn main() {
    let number = 5;
    print!("{}", number);
}
``` -->

This is an image:

![image test](/public/jade.jpg)
