class ReposController < ApplicationController
  def create
    @repo = Repo.new(repo_params)
    respond_to do |format|
      if @repo.save
        @mood = @repo.mood
        format.html { redirect_to root_path }
        format.js   {}
        format.json { render json: @mood, status: :created }
      else
        redirect_to root_path
      end
    end
  end

  def index

  end

  private

  def repo_params
    params.require(:repo).permit(:owner, :name)
  end
end
