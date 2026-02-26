class TripsController < ApplicationController
  before_action :authenticate_user!

  def new
    @trip = Trip.new
    @trip.travelers.build
  end

  def create
    @trip = Trip.new(trip_params)
    @trip.user = current_user

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

  def my_trips
    @trips = current_user.trips.order(created_at: :desc)
  end

  def edit
    @trip = current_user.trips.find_by(id: params[:id])
    redirect_to my_trips_path if @trip.nil?
  end

  def update
    @trip = current_user.trips.find_by(id: params[:id])
    if @trip.update(trip_params)
      redirect_to trip_path(@trip), notice: "Trip updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @trip = current_user.trips.find_by(id: params[:id])
    if @trip
      @trip.destroy
      redirect_to my_trips_path, notice: "Trip deleted."
    else
      redirect_to my_trips_path, alert: "Trip not found."
    end
  end

  private

  def trip_params
    params.require(:trip).permit(
      :destination, :start_date, :end_date, :trip_type, :luggage_type, :sport,
      travelers_attributes: [ :id, :name, :role, :_destroy ]
    )
  end
end
