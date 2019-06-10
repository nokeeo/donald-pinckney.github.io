module ListSearch


data NatList : Type where
    Nil : NatList
    Cons : (x : Nat) -> (tail : NatList) -> NatList

data Contains : (k : Nat) -> (xs : NatList) -> Type where
    Here : Contains k (Cons k tail)
    There : (later : Contains k tail) -> Contains k (Cons x tail)

total
emptyNoContains : Not (Contains k Nil)
emptyNoContains Here impossible
emptyNoContains (There _) impossible

total
neitherHeadNorTail : (k : Nat) -> (x : Nat) -> (tail : NatList) -> Not (k = x) -> Not (Contains k tail) -> Not (Contains k (Cons x tail))
neitherHeadNorTail k x tail k_neq_x k_not_in_tail in_cons = case in_cons of
    Here => k_neq_x Refl
    (There later) => k_not_in_tail later


total
testContains : (k : Nat) -> (xs : NatList) -> Dec (Contains k xs)
testContains k [] = No emptyNoContains
testContains k (Cons x tail) = case decEq k x of
    (Yes Refl) => Yes Here
    (No contra) =>
        case testContains k tail of
            (Yes prf) => Yes (There prf)
            (No contra2) => No (neitherHeadNorTail k x tail contra contra2)



total
insert : Nat -> NatList -> NatList
insert k xs = case testContains k xs of
    (Yes prf) => xs
    (No contra) => Cons k xs

total
insertProved : (k : Nat) -> (xs : NatList) -> (xs' : NatList ** Contains k xs')
insertProved k xs = case testContains k xs of
    (Yes prf) => (xs ** prf)
    (No contra) => (Cons k xs ** Here)
