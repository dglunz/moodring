class PagesController < ApplicationController
  def home
    @repo = Repo.new
  end
end
