class CreateTravelers < ActiveRecord::Migration[8.1]
  def change
    create_table :travelers do |t|
      t.string :name
      t.string :role
      t.references :trip, null: false, foreign_key: true

      t.timestamps
    end
  end
end
