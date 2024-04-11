json.results @pokemons do |pokemon|
  json.id pokemon.id
  json.name pokemon.name
  json.type pokemon.type
  json.captured pokemon.captured
  json.image pokemon.image
end
json.page [@current_page, 0].max
json.page_count @page_count
json.count @total_count
