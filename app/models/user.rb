class User < ActiveRecord::Base
  before_save { |user| user.email = email.downcase }
  VALID_EMAIL = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, uniqueness: true, format: { with: VALID_EMAIL }
  validates :name, presence: true

  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth['provider']
      user.uid      = auth['uid']
      user.token    = auth['credentials']['token']
      user.name     = auth['info']['name']
      user.email    = auth['info']['email']
      user.avatar   = auth['info']['image']
    end
  end

  def request_user
    Faraday.get "https://api.github.com/user/repos" do |request|
      request.params['access_token'] = token
    end
  end

  def repos_response
    @repos_response ||= JSON.parse request_user.body, { symbolize_names: true }
  end

  def public_repos
    repos_response.reject { |repo| repo[:private] }.map { |repo| repo[:full_name] }
  end

  def private_repos
    repos_response.select { |repo| repo[:private] }.map { |repo| repo[:full_name] }
  end
end
