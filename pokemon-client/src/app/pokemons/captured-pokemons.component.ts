import { CommonModule } from "@angular/common";
import { AfterViewInit, Component } from "@angular/core";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Pokemon } from "../pokemon";
import { PokemonDataService } from "../pokemon-data.service";

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

  constructor (private pokemonDataService: PokemonDataService) {}

  toggleCaptured(pokemonRow: Pokemon) {
    this.pokemonDataService.toggleCaptured(pokemonRow).subscribe(() => {
      this.refreshTableData()
    })
  }

  ngAfterViewInit(): void {
    this.refreshTableData()
  }

  private refreshTableData() {
    this.pokemonDataService.getCaptured().subscribe((data)=> {
      this.dataSource = new MatTableDataSource<Pokemon>(data.results)
    })
  }
}
