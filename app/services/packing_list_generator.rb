class PackingListGenerator
  def initialize(trip)
    @trip = trip
  end

  def generate
    return error_result("Invalid trip dates") unless valid_dates?

    duration = [(@trip.end_date - @trip.start_date).to_i, 1].max
    temp = temperature
    travelers = @trip.travelers.any? ? @trip.travelers : [default_traveler]

    packing_per_traveler = travelers.map do |traveler|
      items = base_items(duration, traveler)
      items += weather_items(temp)
      items += shoes_items
      items += beach_items(duration) if @trip.trip_type == "beach"
      items += sport_items if @trip.sport
      items << { name: "rain_jacket", quantity: 1, points: 7 } if precipitation >= 40

      { traveler: traveler, items: items }
    end

    all_items = packing_per_traveler.flat_map { |p| p[:items] }
    total    = total_points(all_items)
    capacity = luggage_capacity
    fits     = total <= capacity

    {
      packing_per_traveler: packing_per_traveler,
      total_points: total,
      capacity: capacity,
      fits: fits,
      error: nil,
      forecast: forecast
    }
  end

  def total_points(items)
    items.sum { |item| item[:quantity] * item[:points] }
  end

  def luggage_capacity
    @trip.luggage_type == "cabin" ? 100 : 250
  end

  private

  def base_items(duration, traveler)
    extra = traveler.role == "child" ? 2 : 0
    [
      { name: "underwear", quantity: duration + extra, points: 1 },
      { name: "socks",     quantity: duration,         points: 1 },
      { name: "t_shirt",   quantity: duration + extra, points: 2 }
    ]
  end

  def weather_items(temp)
    if temp < 10
      [
        { name: "coat",    quantity: 1, points: 10 },
        { name: "sweater", quantity: 2, points: 5 },
        { name: "jeans",   quantity: 2, points: 4 }
      ]
    elsif temp <= 22
      [
        { name: "jacket",  quantity: 1, points: 7 },
        { name: "sweater", quantity: 1, points: 5 },
        { name: "jeans",   quantity: 1, points: 4 }
      ]
    else
      [{ name: "short", quantity: 3, points: 2 }]
    end
  end

  def shoes_items
    items = [{ name: "casual_shoes", quantity: 1, points: 12 }]
    items << { name: "smart_shoes", quantity: 1, points: 12 } if @trip.trip_type == "business"
    items
  end

  def beach_items(duration)
    [
      { name: "swimsuit", quantity: (duration / 3.0).ceil, points: 2 },
      { name: "tongue",   quantity: 1, points: 3 }
    ]
  end

  def sport_items
    [
      { name: "sport_tshirt", quantity: 1, points: 2 },
      { name: "jogging",      quantity: 1, points: 3 },
      { name: "sport_socks",  quantity: 1, points: 1 },
      { name: "basket",       quantity: 1, points: 12 }
    ]
  end

  def default_traveler
    OpenStruct.new(name: "Voyageur", role: "adult")
  end

  def valid_dates?
    @trip.start_date.present? && @trip.end_date.present? &&
      @trip.end_date >= @trip.start_date
  end

  def error_result(message)
    { packing_per_traveler: [], total_points: 0, capacity: luggage_capacity, fits: false, error: message, forecast: [] }
  end

  def weather_data
    return @weather_data if defined?(@weather_data)
    api_key = ENV["OPENWEATHER_API_KEY"]
    response = HTTParty.get(
      "https://api.openweathermap.org/data/2.5/weather",
      query: { q: @trip.destination, appid: api_key, units: "metric" }
    )
    @weather_data = response.success? ? response.parsed_response : nil
  rescue StandardError
    @weather_data = nil
  end

  def forecast
    return @forecast if defined?(@forecast)

    geo = HTTParty.get(
      "https://photon.komoot.io/api/",
      query: { q: @trip.destination, limit: 1 }
    )
    return @forecast = [] unless geo.success?

    feature = geo.parsed_response.dig("features", 0)
    return @forecast = [] unless feature

    lon, lat = feature.dig("geometry", "coordinates")

    response = HTTParty.get(
      "https://api.open-meteo.com/v1/forecast",
      query: {
        latitude: lat,
        longitude: lon,
        daily: "temperature_2m_max,precipitation_sum,weathercode",
        timezone: "auto",
        forecast_days: 7
      }
    )
    return @forecast = [] unless response.success?

    daily = response.parsed_response["daily"]
    dates = daily["time"]
    temps = daily["temperature_2m_max"]
    precip = daily["precipitation_sum"]
    codes = daily["weathercode"]

    @forecast = dates.each_with_index.map do |date, i|
      {
        date: Date.parse(date),
        temp: temps[i].round,
        rain: precip[i] > 2,
        icon: weathercode_to_icon(codes[i])
      }
    end
  rescue StandardError
    @forecast = []
  end

  def weathercode_to_icon(code)
    case code
    when 0 then "Clear"
    when 1, 2, 3 then "Clouds"
    when 51, 53, 55, 61, 63, 65, 80, 81, 82 then "Rain"
    when 71, 73, 75, 77, 85, 86 then "Snow"
    when 95, 96, 99 then "Thunderstorm"
    else "Clouds"
    end
  end

  def temperature
    weather_data&.dig("main", "temp") || 15
  end

  def precipitation
    return 80 if weather_data&.dig("weather", 0, "main") == "Rain"
    return 60 if weather_data&.dig("weather", 0, "main") == "Drizzle"
    weather_data&.dig("rain", "1h") ? 80 : 10
  end
end
