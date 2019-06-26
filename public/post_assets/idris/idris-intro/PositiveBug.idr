module PositiveBug

data MyEmptyList : Type
data EmptyListLTE : Nat -> MyEmptyList -> Type

-- mutual
data MyEmptyList : Type where
    MyNil : MyEmptyList

data EmptyListLTE : Nat -> MyEmptyList -> Type where
    NilLTE : (x : Nat) -> EmptyListLTE x MyNil
