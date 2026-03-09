class PackingListItem < ApplicationRecord
  belongs_to :trip
  belongs_to :traveler, optional: true
end
