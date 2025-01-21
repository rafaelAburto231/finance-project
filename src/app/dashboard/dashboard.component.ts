import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <aside class="w-64 bg-gray-800 text-white p-6">
        <h1 class="text-2xl font-bold mb-6">Finanzas App</h1>
        <nav>
          <ul>
            <li class="mb-4">
              <a routerLink="/inicio" routerLinkActive="text-blue-500" class="hover:text-gray-300">Inicio</a>
            </li>
            <li class="mb-4">
              <a routerLink="/ingresos" routerLinkActive="text-blue-500" class="hover:text-gray-300">Ingresos</a>
            </li>
            <li class="mb-4">
              <a routerLink="/egresos" routerLinkActive="text-blue-500" class="hover:text-gray-300">Egresos</a>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="flex-1 p-6 overflow-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class DashboardComponent {}

