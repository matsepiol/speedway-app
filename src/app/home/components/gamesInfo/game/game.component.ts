import { Component, Input } from "@angular/core";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent {
  @Input() home: string;
  @Input() away: string;

  public teamMapping = {
    Toruń: "Apator Toruń",
    Krosno: "Wilki Krosno",
    Wrocław: "Sparta Wrocław",
    Lublin: "Motor Lublin",
    Gorzów: "Stal Gorzów",
    Grudziądz: "GKM Grudziądz",
    Częstochowa: "Włókniarz Częstochowa",
    Leszno: "Unia Leszno",
  };
}
