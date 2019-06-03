module BST

import NatOrder



-- decideOrder x y = ?decideOrder_rhs


-- ordering : Nat -> Nat ->

data BinaryTree = Empty | HasValue Nat BinaryTree BinaryTree

tree1 : BinaryTree
tree1 = HasValue 5 (HasValue 3 Empty Empty) (HasValue 8 Empty (HasValue 10 Empty Empty))

tree2 : BinaryTree
tree2 = ?tree2_ex

total
insert : BinaryTree -> Nat -> BinaryTree
insert Empty n = HasValue n Empty Empty
insert (HasValue k left right) n =
    case decideOrder n k of
        (LessThan n_lt_k) => HasValue k (insert left n) right
        (Equal n_eq_k) => HasValue k left right
        (GreaterThan n_gt_k) => HasValue k left (insert right n)

total
find : BinaryTree -> Nat -> Bool
find Empty n = False
find (HasValue k left right) n =
    case decideOrder n k of
        (LessThan n_lt_k) => find left n
        (Equal n_eq_k) => True
        (GreaterThan n_gt_k) => find right n


-- find (insert tree n) n --> find (insert Empty n) n --> find (HasValue n Empty Empty) n
total
findTheorem : (tree : BinaryTree) -> (n : Nat) -> find (insert tree n) n = True
findTheorem Empty n = ?findTheorem_rhs_1
findTheorem (HasValue k x y) n = ?findTheorem_rhs_2
