class Repo < ActiveRecord::Base
  def get_commits(owner, name)
    Faraday.get "https://api.github.com/repos/#{owner}/#{name}/commits" do |request|
      request.params['client_id'] = ENV['GITHUB_KEY']
      request.params['client_secret'] = ENV['GITHUB_SECRET']
    end
  end
end
