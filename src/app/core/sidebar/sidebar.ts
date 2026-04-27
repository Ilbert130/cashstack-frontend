import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive], // Necesario para la navegación
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {}
