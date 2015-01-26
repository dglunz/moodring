class Repo < ActiveRecord::Base
  validates :owner, :name, presence: true
  validates :private, exclusion: { in: [nil] }

  def request_repo
    Faraday.get "https://api.github.com/repos/#{owner}/#{name}" do |request|
      request.params['client_id'] = ENV['GITHUB_KEY']
      request.params['client_secret'] = ENV['GITHUB_SECRET']
    end
  end

  def request_commits
    Faraday.get "https://api.github.com/repos/#{owner}/#{name}/commits" do |request|
      request.params['client_id'] = ENV['GITHUB_KEY']
      request.params['client_secret'] = ENV['GITHUB_SECRET']
    end
  end

  def set_privacy
    self.private = repo_info[:private]
  end

  def private?
    private
  end

  def repo_info
    @repo_info ||= JSON.parse request_repo.body, { symbolize_names: true }
  end

  def commits
    @commits ||= JSON.parse request_commits.body, { symbolize_names: true }
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

  def calculate_mood
    sentiments.inject(:+) / messages.size
  end

  def mood_color
    colors = ["#e34a33", "#fdbb84", "#fee8c8", "#e5f5f9", "#99d8c9", "#99d8c9"]
    colors.at(((mood.to_f/100)*5).round)
  end

  def badge
    "<svg width='52px' height='52px' xmlns='http://www.w3.org/2000/svg'>
    <circle cx='30' cy='30' r='20' stroke='#{mood_color}' stroke-width='3' fill='white' />
    <text x='30' y='35' font-size='16px' font-family='Helvetica Neue' font-weight='100' text-anchor='middle' >#{ mood.to_s }</text>
    </svg>"
  end
end
