import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Pokemon } from '../pokemon';
import { PokemonDataService } from '../pokemon-data.service';
import { PokemonIndexData } from '../pokemon-index-data.interface';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, startWith, switchMap, of as observableOf } from 'rxjs';

@Component({
  selector: 'app-pokemons',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './pokemons.component.html',
  styleUrl: './pokemons.component.scss'
})
export class PokemonsComponent implements AfterViewInit {
  columns = ['name', 'type', 'status', 'image']
  pokemons: Pokemon[] = []
  dataSource = new MatTableDataSource<Pokemon>();
  isLoading = false;
  totalCount: number = 0
  pageIndex: number = 0
  pageLength: number = 10


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pokemonDataService: PokemonDataService) {}


  getTableData$(pageNumber: number) {
    return this.pokemonDataService.getPokemons(pageNumber);
  }

  ngAfterViewInit(): void {

    this.dataSource.paginator = this.paginator;
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.getTableData$(
            this.paginator.pageIndex
          ).pipe(catchError(() => observableOf(null)));
        }),
        map((response) => {
          if (response == null) return [];
          this.isLoading = false;
          this.totalCount = response.count
          this.pageIndex = response.page
          return response.results;
        })
      )
      .subscribe((pokemons) => {
        this.pokemons = pokemons;
        this.dataSource = new MatTableDataSource<Pokemon>(this.pokemons);
      });
  }
}
