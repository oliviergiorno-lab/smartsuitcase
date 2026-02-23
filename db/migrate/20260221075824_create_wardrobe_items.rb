class CreateWardrobeItems < ActiveRecord::Migration[8.1]
  def change
    create_table :wardrobe_items do |t|
      t.string :category
      t.integer :quantity
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
