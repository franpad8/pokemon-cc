import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Pokemon } from '../pokemon';
import { PokemonDataService } from '../pokemon-data.service';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import { FormControl } from '@angular/forms';


import { catchError, map, startWith, switchMap, of as observableOf, merge } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-pokemons',
  standalone: true,
  imports: [MatTableModule,
            MatPaginatorModule,
            CommonModule,
            MatChipsModule,
            FormsModule,
            ReactiveFormsModule,
            MatInputModule],
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
  nameFilter = new FormControl();
  typeFilter = new FormControl();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pokemonDataService: PokemonDataService) {}

  getTableData$(nameFilter: string, typeFilter: string, pageNumber: number) {
    return this.pokemonDataService.getPokemons(nameFilter, typeFilter, pageNumber);
  }

  ngAfterViewInit(): void {

    this.dataSource.paginator = this.paginator;


    merge(this.nameFilter.valueChanges, this.typeFilter.valueChanges, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          var nameFilter = this.nameFilter.value == null ? '' : this.nameFilter.value;
          var typeFilter = this.typeFilter.value == null ? '' : this.typeFilter.value;
          return this.getTableData$(
            nameFilter,
            typeFilter,
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
