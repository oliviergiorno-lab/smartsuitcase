class User < ApplicationRecord
  has_many :trips, dependent: :destroy
  has_many :wardrobe_items, dependent: :destroy
end
