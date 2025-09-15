

(define-constant contract-owner (as-contract tx-sender))  ;; the owner of the contract

(define-constant price u1000000) ;; 1000000 micro-stacks

(define-data-var total-posts uint u0)

(define-map posts principal (string-utf8 500)) 



(define-read-only (get-total-posts)
(var-get total-posts)
)

(define-read-only (get-post (user principal))
  (map-get? posts user)
)

(define-public (create-post (message (string-utf8 500)))
  (begin
   
    (try! (stx-transfer? price tx-sender contract-owner))
    (map-set posts tx-sender message)
    (var-set total-posts (+ (var-get total-posts) u1))
    (ok "Post created successfully")
  )
)
  


(define-public (delete-post (user principal))
  (begin
     (asserts! (is-some (map-get? posts user)) (err "Post not found"))
    (map-delete posts user)
    (var-set total-posts (- (var-get total-posts) u1))
    (ok "Post deleted successfully")
  )
)



(define-public (edit-post (user principal) (message (string-utf8 500)))
  (begin
    (asserts! (is-some (map-get? posts user)) (err "Post not found"))
    (map-set posts user message)
    (ok "Post edited successfully")
  )
)

