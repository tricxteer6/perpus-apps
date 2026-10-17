CREATE TABLE IF NOT EXISTS loan_return_requests (
  loan_id BIGINT UNSIGNED PRIMARY KEY,
  member_id BIGINT UNSIGNED NOT NULL,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_return_request_loan
    FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE,
  CONSTRAINT fk_return_request_member
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);
