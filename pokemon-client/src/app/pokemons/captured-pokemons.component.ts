import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, Input } from "@angular/core";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Pokemon } from "../pokemon";
import { PokemonDataService } from "./pokemon-data.service";
import { Observable, Subject, startWith } from "rxjs";

@Component({
  selector: 'app-captured-pokemons',
  standalone: true,
  imports: [MatTableModule,
            CommonModule],
  templateUrl: './captured-pokemons.component.html',
  styleUrl: './captured-pokemons.component.scss'
})


export class CapturedPokemonsComponent implements AfterViewInit {
  columns = ['name', 'image']
  dataSource = new MatTableDataSource<Pokemon>();
  dataChanged$!: Observable<void>

  constructor (private pokemonDataService: PokemonDataService) {
    this.dataChanged$ = pokemonDataService.dataChangedSubject
  }

  toggleCaptured(pokemonRow: Pokemon) {
    this.pokemonDataService.toggleCaptured(pokemonRow).subscribe()
  }

  ngAfterViewInit(): void {
    this.dataChanged$
      .pipe(
        startWith({})
      )
      .subscribe(() => {
        this.refreshTableData()
      })
  }

  private refreshTableData() {
    this.pokemonDataService.getCaptured().subscribe(data => {
      this.dataSource = new MatTableDataSource<Pokemon>(data.results)
    })
  }
}
