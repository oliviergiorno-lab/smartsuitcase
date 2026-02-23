class CreatePackingListItems < ActiveRecord::Migration[8.1]
  def change
    create_table :packing_list_items do |t|
      t.string :name
      t.integer :quantity
      t.integer :volume_points
      t.boolean :matched
      t.string :priority
      t.references :trip, null: false, foreign_key: true

      t.timestamps
    end
  end
end
