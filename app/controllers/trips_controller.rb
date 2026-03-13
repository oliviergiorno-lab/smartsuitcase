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
      generate_and_persist_packing_list
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

  if @trip.packing_list_items.empty?
    generate_and_persist_packing_list
  end

  # Forecast uniquement depuis le generator
  generator = PackingListGenerator.new(@trip)
  @forecast = generator.forecast

  # Items et totaux depuis la DB
  @packing_per_traveler = @trip.travelers.map do |traveler|
    { traveler: traveler, items: traveler.packing_list_items.order(:id) }
  end

  total = @trip.packing_list_items.sum("quantity * volume_points")
  capacity = generator.luggage_capacity

  @result = {
    packing_per_traveler: @packing_per_traveler,
    total_points: total,
    capacity: capacity,
    fits: total <= capacity,
    forecast: @forecast,
    error: nil
  }
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
      @trip.reload
      if @trip.travelers.empty?
        redirect_to edit_trip_path(@trip), alert: "Au moins un voyageur est requis."
        return
      end
      @trip.packing_list_items.destroy_all
      generate_and_persist_packing_list
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

  def generate_and_persist_packing_list
    generator = PackingListGenerator.new(@trip)
    result = generator.generate
    return if result[:error]

    result[:packing_per_traveler].each do |entry|
      traveler = entry[:traveler]
      entry[:items].each do |item|
        @trip.packing_list_items.create!(
          traveler: traveler,
          name: item[:name],
          quantity: item[:quantity],
          volume_points: item[:points]
        )
      end
    end
  end

  def trip_params
    params.require(:trip).permit(
      :destination, :start_date, :end_date, :trip_type, :luggage_type, :sport,
      travelers_attributes: [ :id, :name, :role, :_destroy ]
    )
  end
end
