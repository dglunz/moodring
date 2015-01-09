class SessionsController < ApplicationController
  def new
    @user = User.new
  end

  def create
    user = User.find_by(email: params[:email]).try(:authenticate, params[:password])

    if user
      session[:user_id] = user.id
      redirect_to bench_path, notice: "Welcome to Mood Ring"
    else
      redirect_to root_path, notice: "We could not log you in. Please try again."
    end
  end

  def destroy
    session.clear
    redirect_to root_path, notice: "You've been logged out."
  end
end
