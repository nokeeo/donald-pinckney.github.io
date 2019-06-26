module GCD


data Divides : (d : Nat) -> (m : Nat) -> Type where
    FactorsWith : (d : Nat) -> (f : Nat) -> Divides d (d * f)

div_3_12 : Divides 3 12
div_3_12 = FactorsWith 3 4

total
testDivides : (d : Nat) -> (m : Nat) -> Bool
testDivides d Z = True
testDivides Z (S k) = False
testDivides (S d') (S k') = if (S d') > (S k') then False else testDivides (S d') (minus (S k') (S d'))


total
searchGCD_rec : Nat -> Nat -> Nat -> Nat
searchGCD_rec k j Z = Z--_1
searchGCD_rec k j (S d') = if testDivides (S d') k && testDivides (S d') j then (S d') else searchGCD_rec k j d'

total
searchGCD : Nat -> Nat -> Nat
searchGCD k j = searchGCD_rec k j k -- or j

-- total
-- euclid_rec : Nat -> Nat -> Nat -> Nat -> Nat
-- euclid_rec m n q r = if r >= n then euclid_rec m n (S q) (minus r n) else r


data IsPrime : (n : Nat) -> Type where
    NoDivisor : (d : Nat) -> (n : Nat) -> (Divides d (S n) -> Either (d = 1) (d = S n)) -> IsPrime (S n)

zeroNotPrime : Not (IsPrime Z)
zeroNotPrime (NoDivisor _ _ _) impossible

testPrime : (n : Nat) -> Dec (IsPrime n)
testPrime Z = No zeroNotPrime
testPrime (S n') = ?testPrime_rhs_2
