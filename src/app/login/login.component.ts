import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../service/local-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class LoginComponent {
  correo: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService // Inyectar el servicio
  ) {}

  onLogin(): void {
    this.authService.login(this.correo, this.password).subscribe(response => {
      if (response.status_code === 200) {
        const userData = response.data;
        this.localStorageService.setItem('authToken', 'true');
        this.localStorageService.setItem('userData', JSON.stringify(userData)); // Almacenar datos del usuario

        Swal.fire({
          icon: 'success',
          title: 'Usuario encontrado',
          text: '¡Inicio de sesión exitoso!'
        }).then(() => {
          this.router.navigate(['/menu-estudiante']); // Redirigir a menu-estudiante
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Correo o contraseña incorrectos'
        });
      }
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error en el servidor, por favor intente más tarde'
      });
    });
  }
}
