class User < ActiveRecord::Base
  has_secure_password
  before_save { |user| user.email = email.downcase }

  VALID_EMAIL = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, uniqueness: true, format: { with: VALID_EMAIL }
  validates :name, presence: true
  validates :password, length: { minimum: 6 }
end
