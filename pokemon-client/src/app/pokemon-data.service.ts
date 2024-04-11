import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PokemonIndexData } from './pokemon-index-data.interface';


@Injectable({
  providedIn: 'root'
})

export class PokemonDataService {
  private baseUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  getPokemons(nameFilter: string, typeFilter: string, pageNumber: number): Observable<PokemonIndexData> {
    return this.http.get<PokemonIndexData>(
      `${this.baseUrl}/pokemons.json?page=${pageNumber}&name=${nameFilter}&type=${typeFilter}`,
    )
  }
}