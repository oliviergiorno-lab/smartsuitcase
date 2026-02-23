class Trip < ApplicationRecord
  belongs_to :user, optional: true
  has_many :travelers, dependent: :destroy
  accepts_nested_attributes_for :travelers, allow_destroy: true
  has_many :packing_list_items

  TRIP_TYPES = %w[city beach business hiking].freeze
  LUGGAGE_TYPES = %w[cabin checked].freeze

  validates :destination, presence: true, length: { minimum: 2, maximum: 100 }
  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :trip_type, inclusion: { in: TRIP_TYPES }
  validates :luggage_type, inclusion: { in: LUGGAGE_TYPES }

  validate :end_date_after_start_date
  validate :dates_not_in_past

  private

  def end_date_after_start_date
    return unless start_date && end_date
    if end_date < start_date
      errors.add(:end_date, "must be after start date")
    end
  end

  def dates_not_in_past
    return unless start_date
    if start_date < Date.today
      errors.add(:start_date, "cannot be in the past")
    end
  end
end
