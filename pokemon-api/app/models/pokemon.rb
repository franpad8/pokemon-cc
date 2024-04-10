class Pokemon < ApplicationRecord
  self.inheritance_column = :sti_type

  scope :all_captured, -> { where(captured: true).order(updated_at: :desc) }
end
