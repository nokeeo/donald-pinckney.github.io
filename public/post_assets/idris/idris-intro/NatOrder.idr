module NatOrder

import Decidable.Order

%default total

-- data NatOrder : Nat -> Nat -> Type = LessThan (LT x y) | Equal (x = y) | GreaterThan (GT x y)
public export
data NatOrder : Nat -> Nat -> Type where
    LessThan : LT x y -> NatOrder x y
    Equal : x = y -> NatOrder x y
    GreaterThan : GT x y -> NatOrder x y

-- export
notGT : Not (LTE x y) -> GT x y
notGT {x = Z} {y = y} contra = void $ contra LTEZero
notGT {x = (S k)} {y = Z} contra = LTESucc LTEZero
notGT {x = (S kx)} {y = (S ky)} contra =
    let ih = notGT {x=kx} {y=ky} (contra . LTESucc) in
    LTESucc ih

-- export
notEqLt : LTE x y -> Not (x = y) -> LT x y
notEqLt {x = Z} {y = Z} x_lte_y x_neq_y = void $ x_neq_y Refl
notEqLt {x = Z} {y = (S k)} x_lte_y x_neq_y = LTESucc LTEZero
notEqLt {x = (S k)} {y = Z} x_lte_y x_neq_y = absurd x_lte_y
notEqLt {x = (S kx)} {y = (S ky)} x_lte_y x_neq_y =
    let ih = notEqLt {x=kx} {y=ky} (fromLteSucc x_lte_y) (x_neq_y . cong {f=S}) in
    LTESucc ih


export
decideOrder : (x : Nat) -> (y : Nat) -> NatOrder x y
decideOrder x y = case decEq x y of
    (Yes prf) => Equal prf
    (No x_neq_y) => case decideLTE x y of
        (Yes x_lte_y) => LessThan (notEqLt x_lte_y x_neq_y)
        (No x_gt_y) => GreaterThan (notGT x_gt_y)

export
eqDecEq : {x : Nat} -> (prf ** decEq x x = Yes prf)
eqDecEq {x = Z} = (Refl ** Refl)
eqDecEq {x = (S k)} =
    let (prf_k ** eq_prf_k) = eqDecEq {x=k} in
    rewrite eq_prf_k in
    (cong prf_k ** Refl)

export
equalDecision : (prf ** decideOrder x x = Equal prf)
equalDecision {x = Z} = (Refl ** Refl)
equalDecision {x = (S k)} =
    let (k_k ** eq_prf_k) = equalDecision {x=k} in
    -- rewrite eq_prf_k in
    ?opuqwer
    -- (cong k_k ** ?opupqwer)


-- equalDecision {x} =
--     case decideOrder x x of
--         (LessThan x) => ?poipqowuier_1
--         (Equal prf) =>
--             let (x_x ** eq_prf_x) = eqDecEq {x=x} in
--             (x_x **
--                 -- rewrite eq_prf_x in
--                 ?pouiqpwerqwer
--             )
--         (GreaterThan x) => ?poipqowuier_3
