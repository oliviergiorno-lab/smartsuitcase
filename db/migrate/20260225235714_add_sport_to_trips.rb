class AddSportToTrips < ActiveRecord::Migration[8.1]
  def change
    add_column :trips, :sport, :boolean
  end
end
