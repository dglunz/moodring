Rails.application.routes.draw do
  root 'pages#home'

  get "/commit_sentiments", to: "repos#commit_sentiments"
  get "/repos/:id/badge", to: "repos#badge", format: :svg

  resources :users
  resources :repos

  get    '/login',                   to: "sessions#new"
  get    '/auth/:provider/callback', to: "sessions#create_with_provider"
  post   '/login',                   to: "sessions#create"
  delete '/logout',                  to: "sessions#destroy"
end
