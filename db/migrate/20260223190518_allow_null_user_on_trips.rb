class AllowNullUserOnTrips < ActiveRecord::Migration[8.1]
  def change
    change_column_null :trips, :user_id, true
  end
end
