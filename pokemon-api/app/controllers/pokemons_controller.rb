class PokemonsController < ApplicationController
  before_action :set_pokemon, only: %i[show capture destroy]

  # GET /pokemons
  def index
    query = Pokemon.all
    query = query.where('name LIKE ?', "#{params['name']}%") unless params['name'].nil?
    query = query.where('type LIKE ?', "#{params['type']}%") unless params['type'].nil?

    @current_page = params['page'].to_i
    @total_count = query.count
    @pokemons = query.offset(10 * @current_page).limit(10)
    @page_count = (@total_count % 10).positive? ? @total_count / 10 + 1 : @total_count / 10
    render
  end

  # GET /pokemons/captured
  def captured
    render json: { results: Pokemon.all_captured }, status: :ok
  end

  # GET /pokemons/1
  def show
    render json: @pokemon
  end

  # POST /import_pokemons
  def import
    ::Pokemons::BulkCreateService.call
    render json: { message: 'ok', status: :created }
  end

  # PATCH/PUT /pokemons/1/capture/
  def capture
    ::Pokemons::CaptureService.call(@pokemon)
    render json: @pokemon
  end

  # DELETE /pokemons/1
  def destroy
    @pokemon.update(captured: false)
    render json: @pokemon
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_pokemon
    @pokemon = Pokemon.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def pokemon_params
    params.require(:pokemon).permit(:name, :type, :image, :captured)
  end
end
