import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PokemonIndexData } from './pokemon-index-data.interface';
import { Pokemon } from './pokemon';


@Injectable({
  providedIn: 'root'
})

export class PokemonDataService {
  private baseUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  importPokemons() {
    return this.http.post(
      `${this.baseUrl}/pokemons/import`,
      {}
    )
  }

  getPokemons(nameFilter: string, typeFilter: string, pageNumber: number): Observable<PokemonIndexData> {
    return this.http.get<PokemonIndexData>(
      `${this.baseUrl}/pokemons.json?page=${pageNumber}&name=${nameFilter}&type=${typeFilter}`,
    )
  }

  getCaptured(): Observable<PokemonIndexData> {
    return this.http.get<PokemonIndexData>(
      `${this.baseUrl}/pokemons/captured.json`
    )
  }

  toggleCaptured(pokemon: Pokemon): Observable<Pokemon> {
    if (pokemon.captured) {
      return this.http.delete<Pokemon>(
        `${this.baseUrl}/pokemons/${pokemon.id}.json`,
      )
    } else {
      return this.http.patch<Pokemon>(
        `${this.baseUrl}/pokemons/${pokemon.id}/capture.json`,
        {}
      )
    }
  }
}
