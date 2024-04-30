module Pokemon::Capturable
  extend ActiveSupport::Concern

  self.included do
    def capture
      return if captured

      uncapture_oldest_captured
      self.update(captured: true)
    end

    def uncapture
      update(captured: false)
    end
  end

  private
  def uncapture_oldest_captured
    all_captured = Pokemon.all_captured
    all_captured.last.update(captured: false) unless all_captured.size < 6
  end
end
