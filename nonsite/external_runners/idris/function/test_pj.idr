module Main

test : List Nat -> List Nat
test xs = map (\x => x + 3) xs

test_main : List Nat
test_main = test [4, 3, 8]

main : JS_IO ()
main = putStrLn' (show test_main)