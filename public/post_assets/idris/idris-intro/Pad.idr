module Pad

import Data.Vect

%default total

data Bit : Type where
    ZeroBit : Bit
    OneBit : Bit

xor : Bit -> Bit -> Bit
xor ZeroBit ZeroBit = ZeroBit
xor ZeroBit OneBit = OneBit
xor OneBit ZeroBit = OneBit
xor OneBit OneBit = ZeroBit


bitwiseXor : (len : Nat) -> (xs : Vect len Bit) -> (ys : Vect len Bit) -> Vect len Bit
bitwiseXor Z [] [] = []
bitwiseXor (S len') (x :: xs) (y :: ys) = (xor x y) :: (bitwiseXor len' xs ys)

oneTimePadEncrypt : (len : Nat) -> (message : Vect len Bit) -> (key : Vect len Bit) -> Vect len Bit
oneTimePadEncrypt len message key = bitwiseXor len message key

oneTimePadDecrypt : (len : Nat) -> (cipherText : Vect len Bit) -> (key : Vect len Bit) -> Vect len Bit
oneTimePadDecrypt len cipherText key = bitwiseXor len cipherText key


xorCancel : (x : Bit) -> (y : Bit) -> xor (xor x y) y = x
xorCancel ZeroBit ZeroBit = Refl
xorCancel ZeroBit OneBit = Refl
xorCancel OneBit ZeroBit = Refl
xorCancel OneBit OneBit = Refl

oneTimePadCorrect : (len : Nat) -> (message : Vect len Bit) -> (key : Vect len Bit) -> oneTimePadDecrypt len (oneTimePadEncrypt len message key) key = message
oneTimePadCorrect Z [] [] = Refl
oneTimePadCorrect (S len') (m :: ms) (k :: ks) =
    let headEqual = xorCancel m k in
    rewrite headEqual in
    let ih = oneTimePadCorrect len' ms ks in
    rewrite ih in
    Refl


keyReuseHack : (len : Nat) -> (cipherText1 : Vect len Bit) -> (cipherText2 : Vect len Bit) -> Vect len Bit
keyReuseHack len xs ys = bitwiseXor len xs ys


xorCancel3 : (m1 : Bit) -> (m2 : Bit) -> (k : Bit) -> xor (xor m1 k) (xor m2 k) = xor m1 m2
xorCancel3 ZeroBit ZeroBit ZeroBit = Refl
xorCancel3 ZeroBit ZeroBit OneBit = Refl
xorCancel3 ZeroBit OneBit ZeroBit = Refl
xorCancel3 ZeroBit OneBit OneBit = Refl
xorCancel3 OneBit ZeroBit ZeroBit = Refl
xorCancel3 OneBit ZeroBit OneBit = Refl
xorCancel3 OneBit OneBit ZeroBit = Refl
xorCancel3 OneBit OneBit OneBit = Refl

reuseProof : (len : Nat) -> (message1 : Vect len Bit) -> (message2 : Vect len Bit) -> (key : Vect len Bit) -> keyReuseHack len (oneTimePadEncrypt len message1 key) (oneTimePadEncrypt len message2 key) = bitwiseXor len message1 message2
reuseProof Z [] [] [] = Refl
reuseProof (S len') (m1 :: ms1) (m2 :: ms2) (k :: ks) =
    rewrite xorCancel3 m1 m2 k in
    rewrite reuseProof len' ms1 ms2 ks in
    Refl


xorCommutative : (x : Bit) -> (y : Bit) -> (xor x y) = (xor y x)
xorCommutative ZeroBit ZeroBit = Refl
xorCommutative ZeroBit OneBit = Refl
xorCommutative OneBit ZeroBit = Refl
xorCommutative OneBit OneBit = Refl

xorAssociative : (left : Bit) -> (middle : Bit) -> (right : Bit) -> (xor (xor left middle) right) = (xor left (xor middle right))
xorAssociative ZeroBit ZeroBit ZeroBit = Refl
xorAssociative ZeroBit ZeroBit OneBit = Refl
xorAssociative ZeroBit OneBit ZeroBit = Refl
xorAssociative ZeroBit OneBit OneBit = Refl
xorAssociative OneBit ZeroBit ZeroBit = Refl
xorAssociative OneBit ZeroBit OneBit = Refl
xorAssociative OneBit OneBit ZeroBit = Refl
xorAssociative OneBit OneBit OneBit = Refl

xorZeroRightNeutral : (x : Bit) -> xor x ZeroBit = x
xorZeroRightNeutral ZeroBit = Refl
xorZeroRightNeutral OneBit = Refl

xorSameCancel : (x : Bit) -> ZeroBit = xor x x
xorSameCancel ZeroBit = Refl
xorSameCancel OneBit = Refl

xorCancel_nicer : (x : Bit) -> (y : Bit) -> xor (xor x y) y = x
xorCancel_nicer x y =
    rewrite xorAssociative x y y in
    rewrite sym (xorSameCancel y) in
    xorZeroRightNeutral x

xorCancel3_nicer : (m1 : Bit) -> (m2 : Bit) -> (k : Bit) -> xor (xor m1 k) (xor m2 k) = xor m1 m2
xorCancel3_nicer m1 m2 k =
    rewrite xorCommutative m2 k in
    rewrite sym (xorAssociative (xor m1 k) k m2) in
    rewrite xorAssociative m1 k k in
    rewrite sym (xorSameCancel k) in
    rewrite xorZeroRightNeutral m1 in
    Refl
