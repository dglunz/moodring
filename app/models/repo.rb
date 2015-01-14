class Repo < ActiveRecord::Base
  def request
    Faraday.get "https://api.github.com/repos/#{owner}/#{name}/commits" do |request|
      request.params['client_id'] = ENV['GITHUB_KEY']
      request.params['client_secret'] = ENV['GITHUB_SECRET']
    end
  end

  def commits
    @commits ||= JSON.parse request.body, { symbolize_names: true }
  end

  def messages
    commits.map{ |commit| commit[:commit][:message] }
  end

  def sentiments
    @sentiments ||= messages.map { |commit| analyze_sentiment(commit) }
  end

  def analyze_sentiment(commit)
    (Sentimentalizer.analyze(commit).overall_probability * 100).round
  end

  def messages_with_sentiment
    messages.zip sentiments
  end

  def mood
    sentiments.inject(:+) / messages.count
  end
end
