class TripsController < ApplicationController
  def new
    @trip = Trip.new
  end

  def create
    @trip = Trip.new(trip_params)
    @trip.user = User.first  # TODO: remplacer par current_user avec Devise

    if @trip.save
      redirect_to trip_path(@trip)
    else
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @trip = Trip.find_by(id: params[:id])

    if @trip.nil?
      redirect_to new_trip_path, alert: "Trip not found."
      return
    end

    generator = PackingListGenerator.new(@trip)
    @result = generator.generate

    if @result[:error]
      redirect_to new_trip_path, alert: @result[:error]
    end
  end

  private

  def trip_params
    params.require(:trip).permit(:destination, :start_date, :end_date, :trip_type, :luggage_type)
  end
end
