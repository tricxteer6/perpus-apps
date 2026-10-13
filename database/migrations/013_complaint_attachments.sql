CREATE TABLE IF NOT EXISTS complaint_attachments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  complaint_id BIGINT UNSIGNED NOT NULL,
  file_name VARCHAR(180) NOT NULL,
  mime_type VARCHAR(40) NOT NULL,
  image_data MEDIUMTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_complaint_attachments_complaint (complaint_id),
  CONSTRAINT fk_complaint_attachment
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);
