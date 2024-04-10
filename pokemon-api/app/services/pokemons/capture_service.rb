module Pokemons
  class CaptureService < BaseService
    def initialize(pokemon)
      @pokemon = pokemon
    end

    def call
      return if @pokemon.captured

      all_captured = Pokemon.all_captured
      all_captured.last.update(captured: false) unless all_captured.size < 6
      @pokemon.update(captured: true)
    end
  end
end
