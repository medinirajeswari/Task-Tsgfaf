
use pro

CREATE TABLE testimonials (
  _id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  quote TEXT,
  image VARCHAR(255),
  date DATE
);
