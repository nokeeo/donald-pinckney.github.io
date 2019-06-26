module Sorting

import NatOrder
import Decidable.Order

%default total

data SortedList : Type
data ListLTE : Nat -> SortedList -> Type

data SortedList : Type where
    Nil : SortedList
    Cons : (x : Nat) -> (rest : SortedList) -> ListLTE x rest -> SortedList

data ListLTE : Nat -> SortedList -> Type where
    NilLTE : (x : Nat) -> ListLTE x Nil
    ConsLTE : (b : Nat) -> (x : Nat) -> (rest : SortedList) ->
                LTE b x -> (x_lte_rest : ListLTE x rest) ->
                ListLTE b (Cons x rest x_lte_rest)

-- data Elem : Nat -> List Nat -> Type where
--     Here : Elem x xs
--     There : (later : Elem x rest) -> Elem x (y :: rest)
--
-- data ElemS : Nat -> SortedList -> Type where
--     HereS : ElemS x (Cons x rest x_lte_rest)
--     ThereS : (later : ElemS x rest) -> ElemS x (Cons y rest y_lte_rest)

data ElemCount : Nat -> List Nat -> Nat -> Type where
    NilNone : ElemCount e [] 0
    HereAnother : ElemCount x rest c -> ElemCount x (x :: rest) (S c)
    ThereSome : ElemCount e rest c -> Not (e = x) -> ElemCount e (x :: rest) c

data ElemCountS : Nat -> SortedList -> Nat -> Type where
    NilNoneS : ElemCountS e Nil 0
    HereAnotherS : ElemCountS x rest c -> ElemCountS x (Cons x rest x_lte_rest) (S c)
    ThereSomeS : ElemCountS e rest c -> Not (e = x) -> ElemCountS e  (Cons x rest x_lte_rest) c

-- data SameElemCounts : List Nat -> SortedList -> Type where
--     AllSame : (xs : List Nat) -> (xs' : SortedList) ->
--         ((e : Nat) -> (c : Nat) -> (ElemCount e xs c -> ElemCountS e xs' c, ElemCountS e xs' c -> ElemCount e xs c))
--         -> SameElemCounts xs xs'

SameElemCounts : List Nat -> SortedList -> Type
SameElemCounts xs xs' = (e : Nat) -> (c : Nat) -> ElemCount e xs c -> ElemCountS e xs' c

SameElemCountsBack : List Nat -> SortedList -> Type
SameElemCountsBack xs xs' = (e : Nat) -> (c : Nat) -> ElemCountS e xs' c -> ElemCount e xs c

equivMetrics : (xs : List Nat) -> (xs' : SortedList) -> SameElemCounts xs xs' -> SameElemCountsBack xs xs'

-- [1, 2, 3, 4]   vs  [1, 2, 3]
-- 4 ~> 1              -- 4 ~> 0

elemCountNil : ElemCount e [] c -> c = 0
elemCountNil NilNone = Refl

elemCountSNil : ElemCountS e Nil c -> c = 0
elemCountSNil NilNoneS = Refl

sameCountsNil : SameElemCounts [] Nil
sameCountsNil e c e_c =
        rewrite elemCountNil e_c in
        NilNoneS

listOrderTrans : LTE b1 b2 -> ListLTE b2 zs -> ListLTE b1 zs
listOrderTrans {zs = []} {b1} b1_lte_b2 (NilLTE b2) = NilLTE b1
listOrderTrans {b1} {b2} {zs = (Cons z rest z_lte_rest)} b1_lte_b2 (ConsLTE b2 z rest b2_lte_z z_lte_rest) =
    ConsLTE b1 z rest (lteTransitive b1_lte_b2 b2_lte_z) z_lte_rest

listConsLTE : (h_lte_rest : ListLTE h rest) -> ListLTE h (Cons h rest h_lte_rest)
listConsLTE {h} {rest} h_lte_rest = ConsLTE h h rest lteRefl h_lte_rest

listLTEZero : ListLTE 0 xs
listLTEZero {xs = []} = NilLTE 0
listLTEZero {xs = (Cons x rest x_lte_rest)} = ConsLTE 0 x rest LTEZero x_lte_rest

-- listUnConsLTE : ListLTE b (Cons h rest h_lte_rest) -> ListLTE b rest
-- listUnConsLTE (ConsLTE b h rest b_lte_h h_lte_rest) = listOrderTrans b_lte_h h_lte_rest



-- -- data MySortedList : Type where
-- --     Nil : MySortedList
-- --     Cons : (x : Nat) -> (h : Nat) -> (rest : SortedList) -> ()
--
-- data Sorted : List Nat -> Type where
--     NilSorted : Sorted Nil
--     ConsSorted : (x : Nat) -> (h : Nat) -> (rest : List Nat) -> Sorted (h :: rest) -> LTE x h -> Sorted (x :: h :: rest)
--
-- SortedList : Type
-- SortedList = (xs : List Nat ** Sorted xs)

-- lte_gt_trans : LTE small med -> Not (LTE med big) -> LTE


    -- ConsLTE : (b : Nat) -> (x : Nat) -> (rest : SortedList) ->
    --             LTE b x -> (x_lte_rest : ListLTE x rest) ->
    --             ListLTE b (Cons x rest x_lte_rest)


insertBounded : (xs : SortedList) -> (x : Nat) -> (b : Nat) -> LTE b x -> ListLTE b xs -> (res : SortedList ** ListLTE b res)
insertBounded [] x b b_lte_x b_lte_xs = (Cons x Nil (NilLTE x) ** ConsLTE b x Nil b_lte_x (NilLTE x))
insertBounded (Cons h rest h_lte_rest) x b b_lte_x (ConsLTE b h rest b_lte_h h_lte_rest) =
    case decideLTE x h of
        (Yes x_lte_h) =>
            let h_lte_hrest = listConsLTE h_lte_rest in
            let x_lte_hrest = listOrderTrans x_lte_h h_lte_hrest in
            let x_lte_xhrest = listConsLTE x_lte_hrest in
            let b_lte_xhrest = listOrderTrans b_lte_x x_lte_xhrest in
            (Cons x (Cons h rest h_lte_rest) x_lte_hrest ** b_lte_xhrest)
        (No x_gt_h) =>
            let h_lte_x : LTE h x = ?poiuqwer in
            let (ins ** h_lte_ins) = insertBounded rest x h h_lte_x h_lte_rest in
            let h_lte_hins = listConsLTE h_lte_ins in
            (Cons h ins h_lte_ins ** listOrderTrans b_lte_h h_lte_hins)

insert : (xs : SortedList) -> (x : Nat) -> SortedList
insert xs x = fst (insertBounded xs x 0 LTEZero listLTEZero)

insertionSort : (input : List Nat) -> (res : SortedList ** SameElemCounts input res)
insertionSort [] = (Nil ** ?ssameCountsNil)
insertionSort (x :: xs) =
    let (res_tail ** res_tail_prf) = insertionSort xs in
    (insert res_tail x ** ?poiweuwereyyyee)

half : Nat -> Nat
half Z = Z
half (S Z) = Z
half (S (S k)) = S (half k)

dropListLen : (xs : List Nat) -> (n : Nat) -> LTE n (length xs) -> length (drop n xs) = length xs - n
dropListLen xs Z n_lte_xs = sym $ minusZeroRight (length xs)
dropListLen [] (S k) n_lte_xs = absurd n_lte_xs
dropListLen (x :: xs) (S k) n_lte_xs = dropListLen xs k (fromLteSucc n_lte_xs)


dropListNonEmpty : (xs : List Nat) -> (n : Nat) -> LT n (length xs) -> NonEmpty (drop n xs)
dropListNonEmpty [] Z lt_prf = absurd lt_prf
dropListNonEmpty (x :: xs) Z lt_prf = IsNonEmpty
dropListNonEmpty [] (S k) lt_prf = absurd lt_prf
dropListNonEmpty (x :: xs) (S k) lt_prf = dropListNonEmpty xs k (fromLteSucc lt_prf)

halfLT : (x : Nat) -> Not (x = 0) -> LT (half x) x
halfLT Z y = void $ y $ Refl
halfLT (S Z) x_not_0 = LTESucc LTEZero
halfLT (S (S Z)) x_not_0 = LTESucc (LTESucc LTEZero)
halfLT (S (S (S k))) x_not_0 =
    let ih = halfLT (S k) SIsNotZ in
    let ih' = LTESucc ih in
    lteSuccRight ih'

nonEmptyLen : NonEmpty xs -> Not (length xs = 0)
nonEmptyLen {xs = (x :: ys)} IsNonEmpty = SIsNotZ

dropHalfNE : (xs : List Nat) -> NonEmpty xs -> NonEmpty (drop (half (length xs)) xs)
dropHalfNE xs ne =
    let lenNZ = nonEmptyLen ne in
    let halfLenLT = halfLT (length xs) lenNZ in
    dropListNonEmpty xs (half (length xs)) halfLenLT

splitList : (xs : List Nat) -> NonEmpty xs -> (List Nat, Nat, List Nat)
splitList xs nonempty =
    let n = half (length xs) in
    let left = take n xs in
    let right' = drop n xs in
    let ne : NonEmpty (right') = dropHalfNE xs nonempty in
    let middle = head {ok=ne} right' in
    let right = drop 1 right' in
    (left, middle, right)

headCombine : (xs : List Nat) -> (ne : NonEmpty xs) -> (head xs {ok=ne}) :: (drop 1 xs) = xs
headCombine [] IsNonEmpty impossible
headCombine (x :: xs) ne = Refl

takeCombine : (xs : List Nat) -> (n : Nat) -> take n xs ++ drop n xs = xs
takeCombine [] Z = Refl
takeCombine [] (S k) = Refl
takeCombine (x :: xs) Z = Refl
takeCombine (x :: xs) (S k) =
    rewrite takeCombine xs k in
    Refl

splitListCombine : (xs : List Nat) -> (ne : NonEmpty xs) ->
    let (left, middle, right) = splitList xs ne in left ++ (middle :: right) = xs
splitListCombine xs ne =
    let dropNonEmpty = dropHalfNE xs ne in
    rewrite headCombine (drop (half (length xs)) xs) dropNonEmpty in
    takeCombine xs (half (length xs))

binarySearch : (xs : SortedList) -> (y : Nat) -> Bool
-- binarySearch ([] ** xs_sorted) y = False

-- binarySearch (x :: rest ** xs_sorted) y =
--     let (left, middle, right) = splitList (x :: rest) IsNonEmpty in
--     case decideOrder x middle of
--         (LessThan x_lt_m) => ?iupoquwer_1
--         (Equal x_m) => ?iupoquwer_2
--         (GreaterThan x_gt_m) => ?iupoquwer_3


-- data BinaryElem : Nat -> List Nat -> Type where
--     ElemSingle : (y : Nat) -> BinaryElem y (left ++ (y :: right))
--     ElemLeft : (left : List Nat) -> (y : Nat) -> (right : List Nat) -> BinaryElem y left -> BinaryElem y (left ++ right)
--     ElemRight : (left : List Nat) -> (y : Nat) -> (right : List Nat) -> BinaryElem y left -> BinaryElem y (left ++ right)
