Rails.application.routes.draw do
  devise_for :users
  resources :trips, only: [ :new, :create, :show, :destroy, :edit, :update ]
    get "my_trips", to: "trips#my_trips", as: :my_trips
  root "trips#new"
  get "up" => "rails/health#show", as: :rails_health_check
end
