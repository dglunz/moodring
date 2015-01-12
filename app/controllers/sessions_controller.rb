class SessionsController < ApplicationController
  def new
    @user = User.new
  end

  def create_with_provider
    auth = request.env["omniauth.auth"]
    user = User.find_by_provider_and_uid(auth["provider"], auth["uid"]) || User.create_with_omniauth(auth)

    if user
      session[:user_id] = user.id
      redirect_to root_url, notice: "Signed in!"
    else
      redirect_to root_url, notice: "Could not authenticate! Try again."
    end
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
