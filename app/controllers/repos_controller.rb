require 'reloader/sse'

class ReposController < ApplicationController
  include ActionController::Live

  def commit_sentiments
    @repo = Repo.find(params[:id])
    response.headers['Content-Type'] = 'text/event-stream'
    sse = Reloader::SSE.new(response.stream)
    begin
      @repo.messages.each do |msg|
        senti = @repo.analyze_sentiment(msg)
        sse.write({ msg: msg, score: senti })
      end
      sse.write("stream_end")
    rescue IOError
    ensure
      sse.close
    end
  end

  def create
    @repo = Repo.new(repo_params)
    @repo.set_privacy
    respond_to do |format|
      if @repo.save
        format.js { }
      else
        format.js { render "failed" }
      end
    end
  end

  def new
    owner, name = params[:repo].split("/")
    @repo = Repo.new(owner: owner, name: name)
    @repo.set_privacy
    if @repo.save
      redirect_to repo_path @repo
    else
    end
  end

  def badge
    @repo = Repo.find(params[:id])
    svg = @repo.badge
    respond_to do |format|
      format.svg { render inline: svg }
    end
  end

  def index
  end

  def show
    @repo = Repo.find(params[:id])
  end
  
  def update
    repo = Repo.find(params[:id])
    mood = params[:mood].to_i / 30
    repo.update_attributes(mood: mood)
    render nothing: true
  end

  private

  def repo_params
    params.require(:repo).permit(:owner, :name)
  end
end
