class User < ActiveRecord::Base
  before_save { |user| user.email = email.downcase }

  VALID_EMAIL = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, uniqueness: true, format: { with: VALID_EMAIL }
  validates :name, presence: true

  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth['provider']
      user.uid      = auth['uid']
      user.name     = auth['info']['name']
      user.email    = auth['info']['email']
      user.avatar   = auth['info']['image']
    end
  end
end
