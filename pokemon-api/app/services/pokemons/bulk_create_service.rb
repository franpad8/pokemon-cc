require 'rest-client'

module Pokemons
  class BulkCreateService < BaseService
    def call
      ActiveRecord::Base.transaction do
        Pokemon.delete_all
        pokemons = []
        (1..35).each do |id|
          pokemon_details_url = "https://pokeapi.co/api/v2/pokemon/#{id}"
          response = RestClient.get(pokemon_details_url, { accept: :json })
          data = JSON.parse(response)
          pokemons.push({ id:,
                          name: data['name'],
                          type: data['types'][0]['type']['name'],
                          captured: false,
                          image: data['sprites']['front_default'] })
        end

        Pokemon.insert_all pokemons
      end
    end
  end
end
