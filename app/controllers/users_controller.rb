class UsersController < ApplicationController
  def index
   @users = User.all
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id
      redirect_to root_url
    else
      render :back
    end
  end

  def show
    @user = User.find(params[:id])
    @token = session[:token]
  end

  private

  def user_params
    params.require(:user).permit(:email, :name, :password, :password_confirmation)
  end
end
