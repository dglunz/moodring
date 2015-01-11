class ReposController < ApplicationController
  def create
    @repo = Repo.new(repo_params)
    @commits = @repo.get_commit_messages(params[:repo])
    binding.pry
    if @repo.save
      redirect_to root_path
    else
      redirect_to root_path
    end
  end

  def index

  end

  private

  def repo_params
    params.require(:repo).permit(:owner, :name)
  end
end
