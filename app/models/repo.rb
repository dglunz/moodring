class Repo < ActiveRecord::Base
  def get_commits(repo)
    commits = Faraday.get "https://api.github.com/repos/#{repo[:owner]}/#{repo[:name]}/commits" do |request|
      request.params['client_id'] = ENV['GITHUB_KEY']
      request.params['client_secret'] = ENV['GITHUB_SECRET']
    end.body
    JSON.parse commits, { symbolize_names: true }
  end

  def get_commit_messages(repo)
    get_commits(repo).map{ |commit| commit[:commit][:message] }
  end
end
