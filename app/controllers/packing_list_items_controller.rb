class PackingListItemsController < ApplicationController
  before_action :authenticate_user!

  def update_quantity
    item = PackingListItem.find(params[:id])
    quantity = params[:quantity].to_i

    if quantity >= 0 && item.trip.user == current_user
      item.update!(quantity: quantity)
      render json: { quantity: item.quantity, total_points: item.quantity * item.volume_points }
    else
      render json: { error: "unauthorized" }, status: :forbidden
    end
  end
end
