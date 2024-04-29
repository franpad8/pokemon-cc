require "rest-client"

module Pokemons
  class BulkCreateService < BaseService

    def initialize
      super
      @conn = Faraday.new do |f|
        f.adapter :typhoeus
        f.response :json
      end
    end

    def call
      ActiveRecord::Base.transaction do
        Pokemon.delete_all
        pokemons = retrieve_pokemons
        Pokemon.insert_all pokemons
      end
    end
    private

    def retrieve_pokemons
      responses = run_requests_in_parallel
      map_responses_data_to_array responses
    end
    def run_requests_in_parallel
      responses = []
      @conn.in_parallel do
        responses = (1..150).to_a.map do |id|
          pokemon_details_url = "https://pokeapi.co/api/v2/pokemon/#{id}"
          @conn.get(pokemon_details_url)
        end
      end
      responses
    end

    def map_responses_data_to_array(responses)
      responses.map do |response|
        data = response.body
        {
          id: data["id"],
          name: data["name"],
          type: data["types"][0]["type"]["name"],
          captured: false,
          image: data["sprites"]["front_default"]
        }
      end
    end

  end
end
