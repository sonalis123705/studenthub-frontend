
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  menuOpen = signal(false);

  closeMenu() {
    this.menuOpen.set(false);
  }

  toggleMenu() {
    this.menuOpen.update(open => !open);
  }
}
