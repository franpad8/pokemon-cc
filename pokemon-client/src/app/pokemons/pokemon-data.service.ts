import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { PokemonIndexData } from '../pokemon-index-data.interface';
import { Pokemon } from '../pokemon';


@Injectable({
  providedIn: 'root'
})

export class PokemonDataService {
  private baseUrl = 'http://localhost:3000'

  private dataChanged: Subject<void> = new Subject<void>()

  constructor(private http: HttpClient) { }

  importPokemons() {
    return this.http.post(
      `${this.baseUrl}/pokemons/import`,
      {}
    ).pipe(map(result => {
      this.dataChanged.next()
      return result
    }))
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
      ).pipe(map(result => {
        this.dataChanged.next()
        return result
      }))
    } else {
      return this.http.patch<Pokemon>(
        `${this.baseUrl}/pokemons/${pokemon.id}/capture.json`,
        {}
      ).pipe(map(result => {
        this.dataChanged.next()
        return result
      }))
    }
  }

  get dataChangedSubject(): Observable<void> {
    return this.dataChanged.asObservable()
  }
}
