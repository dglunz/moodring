Rails.application.routes.draw do
  root 'pages#home'

  resources :users
  resources :repos

  get    '/login',                   to: "sessions#new"
  get    '/auth/:provider/callback', to: "sessions#create_with_provider"
  post   '/login',                   to: "sessions#create"
  delete '/logout',                  to: "sessions#destroy"
end
