class Traveler < ApplicationRecord
  belongs_to :trip

  ROLES = %w[adult child].freeze

  validates :name, presence: true
  validates :role, inclusion: { in: ROLES }
end
