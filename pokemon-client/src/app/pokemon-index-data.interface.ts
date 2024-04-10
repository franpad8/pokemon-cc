import { Pokemon } from "./pokemon"

export interface PokemonIndexData {
  results: Pokemon[]
  page: number
  page_count: number
  count: number
}
