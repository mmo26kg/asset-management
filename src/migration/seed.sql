-- seed.sql

-- Insert into Currency
INSERT INTO Currency (id, name, symbol, isActive) VALUES
  (UUID(), 'United States Dollar', '$', true),
  (UUID(), 'Euro', '€', true),
  (UUID(), 'Japanese Yen', '¥', true),
  (UUID(), 'British Pound', '£', true);


