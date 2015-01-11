class Repo < ActiveRecord::Base
  def commits
    @commits ||= Faraday.get "https://api.github.com/repos/#{owner}/#{name}/commits" do |request|
      request.params['client_id'] = ENV['GITHUB_KEY']
      request.params['client_secret'] = ENV['GITHUB_SECRET']
    end.body
    JSON.parse @commits, { symbolize_names: true }
  end

  def messages
    commits.map{ |commit| commit[:commit][:message] }
  end

  def sentiment
    @sentiment ||= messages.map { |commit| Sentimentalizer.analyze(commit).overall_probability }
  end

  def mood
    sentiment.inject(:+) / messages.count
  end
end
