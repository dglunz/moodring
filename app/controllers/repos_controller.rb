class ReposController < ApplicationController
  def create
    @repo = Repo.new(repo_params)
    @repo.set_privacy
    respond_to do |format|
      if @repo.save
        format.html { redirect :back }
        format.js   {}
      else
        format.html { redirect :back }
        format.js   { render "failed" }
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
