class PackingListGenerator
  def initialize(trip)
    @trip = trip
  end

  def generate
    return error_result("Invalid trip dates") unless valid_dates?

    items = []
    duration = [(@trip.end_date - @trip.start_date).to_i, 1].max

    items << { name: "underwear", quantity: duration, points: 1 }
    items << { name: "socks",     quantity: duration, points: 1 }
    items << { name: "t_shirt",   quantity: duration, points: 2 }

    temp = temperature

    if temp < 10
      items << { name: "coat",    quantity: 1, points: 10 }
      items << { name: "sweater", quantity: 2, points: 5 }
      items << { name: "jeans",   quantity: 2, points: 4 }
    elsif temp <= 22
      items << { name: "jacket",  quantity: 1, points: 7 }
      items << { name: "sweater", quantity: 1, points: 5 }
      items << { name: "jeans",   quantity: 1, points: 4 }
    else
      items << { name: "short",   quantity: 3, points: 2 }
    end

    items << { name: "rain_jacket", quantity: 1, points: 7 } if precipitation >= 40

    total    = total_points(items)
    capacity = luggage_capacity
    fits     = total <= capacity

    {
      items: items,
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

  def valid_dates?
    @trip.start_date.present? && @trip.end_date.present? &&
      @trip.end_date >= @trip.start_date
  end

  def error_result(message)
    { items: [], total_points: 0, capacity: luggage_capacity, fits: false, error: message, forecast: [] }
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
    api_key = ENV["OPENWEATHER_API_KEY"]
    response = HTTParty.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      query: { q: @trip.destination, appid: api_key, units: "metric", cnt: 40 }
    )
    return @forecast = [] unless response.success?

    # Groupe par jour et prend la moyenne
    by_day = response.parsed_response["list"].group_by do |entry|
      Time.at(entry["dt"]).to_date
    end

    @forecast = by_day.map do |date, entries|
      temps = entries.map { |e| e.dig("main", "temp") }.compact
      rain  = entries.any? { |e| ["Rain", "Drizzle", "Thunderstorm"].include?(e.dig("weather", 0, "main")) }
      icon  = entries.first.dig("weather", 0, "main")

      {
        date: date,
        temp: temps.sum / temps.size,
        rain: rain,
        icon: icon
      }
    end
  rescue StandardError
    @forecast = []
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
