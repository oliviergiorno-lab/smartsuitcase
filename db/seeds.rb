puts "Cleaning database..."
PackingListItem.destroy_all
Trip.destroy_all
WardrobeItem.destroy_all
User.destroy_all

puts "Creating user..."
user = User.create!(email: "test@example.com")

puts "Creating trip..."
trip = user.trips.create!(
  destination: "Paris",
  start_date: Date.today + 7.days,
  end_date: Date.today + 10.days,
  trip_type: "city",
  luggage_type: "cabin"
)

puts "Creating wardrobe items..."
user.wardrobe_items.create!(category: "t_shirt", quantity: 5)
user.wardrobe_items.create!(category: "jeans", quantity: 2)
user.wardrobe_items.create!(category: "sweater", quantity: 3)

puts "Done! ✅"
