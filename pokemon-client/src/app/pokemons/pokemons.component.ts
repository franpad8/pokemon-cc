import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Pokemon } from '../pokemon';
import { PokemonDataService } from './pokemon-data.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { FormControl } from '@angular/forms';

import { catchError, map, startWith, switchMap, of as observableOf, merge, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CapturedPokemonsComponent } from './captured-pokemons.component';
import { ProgressSpinnerDialogComponent } from '../ui/progress-spinner-dialog.component';


@Component({
  selector: 'app-pokemons',
  standalone: true,
  imports: [CapturedPokemonsComponent,
            MatTableModule,
            MatButtonModule,
            MatPaginatorModule,
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            MatInputModule],
  templateUrl: './pokemons.component.html',
  styleUrl: './pokemons.component.scss'
})
export class PokemonsComponent implements AfterViewInit {
  columns = ['name', 'type', 'status', 'image']
  dataSource = new MatTableDataSource<Pokemon>();
  isLoading = false;
  totalCount: number = 0
  pageIndex: number = 0
  pageLength: number = 10
  nameFilter = new FormControl();
  typeFilter = new FormControl();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(CapturedPokemonsComponent, { static: false }) capturedPokemonComponent!: CapturedPokemonsComponent

  constructor(private pokemonDataService: PokemonDataService, private dialog: MatDialog) {}

  getTableData$(nameFilter: string, typeFilter: string, pageNumber: number) {
    return this.pokemonDataService.getPokemons(nameFilter, typeFilter, pageNumber);
  }

  toggleCaptured(pokemonRow: Pokemon) {
    this.pokemonDataService.toggleCaptured(pokemonRow).subscribe(() => {
      this.refreshPokemonTableData()
      this.capturedPokemonComponent.retrieveCaptured()
    })
  }

  importPokemonData() {
    let dialogRef: MatDialogRef<ProgressSpinnerDialogComponent> = this.dialog.open(ProgressSpinnerDialogComponent, {
      panelClass: 'transparent',
      disableClose: true
    });
    this.pokemonDataService.importPokemons().subscribe(() => {
      this.refreshPokemonTableData()
      dialogRef.close()
    },
    () => {
      dialogRef.close()
    })
  }

  refreshPokemonTableData () {
    var nameFilter = this.nameFilter.value == null ? '' : this.nameFilter.value;
    var typeFilter = this.typeFilter.value == null ? '' : this.typeFilter.value;
    this.getTableData$(
      nameFilter,
      typeFilter,
      this.paginator.pageIndex
    ).subscribe((data) => {
      this.dataSource = new MatTableDataSource<Pokemon>(data.results)
    })
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
        this.dataSource = new MatTableDataSource<Pokemon>(pokemons);
      });
  }
}
