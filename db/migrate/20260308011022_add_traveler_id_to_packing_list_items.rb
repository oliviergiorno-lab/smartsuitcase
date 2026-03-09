class AddTravelerIdToPackingListItems < ActiveRecord::Migration[8.1]
  def change
    add_reference :packing_list_items, :traveler, null: true, foreign_key: true
  end
end
