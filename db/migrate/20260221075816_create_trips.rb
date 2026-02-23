class CreateTrips < ActiveRecord::Migration[8.1]
  def change
    create_table :trips do |t|
      t.string :destination
      t.date :start_date
      t.date :end_date
      t.string :trip_type
      t.string :luggage_type
      t.jsonb :weather_data
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
