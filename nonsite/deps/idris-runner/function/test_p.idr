module Main

test : List Nat -> List Nat
test xs = map (\x => x + 3) xs

test_main : List Nat -> List Nat
test_main xs = ?test_main_rhs

-- main : IO ()
-- main = putStrLn (show test_main)
