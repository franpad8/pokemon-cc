import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../pokemon';
import { PokemonDataService } from '../pokemon-data.service';
import { PokemonIndexData } from '../pokemon-index-data.interface';

@Component({
  selector: 'app-pokemons',
  standalone: true,
  imports: [],
  templateUrl: './pokemons.component.html',
  styleUrl: './pokemons.component.scss'
})
export class PokemonsComponent implements OnInit {
  pokemons: Pokemon[] = []

  constructor(private pokemonDataService: PokemonDataService) {}

  ngOnInit(): void {
    this.pokemonDataService.getPokemons().subscribe((pokemonData: PokemonIndexData)   => {
      console.log(pokemonData)
      this.pokemons = pokemonData.results
    })
  }
}
