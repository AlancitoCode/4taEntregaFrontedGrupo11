import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Pregunta } from '../model/pregunta';
import { PreguntasService } from '../service/preguntas.service';
import { LocalStorageService } from '../service/local-storage.service';

@Component({
  selector: 'app-menu-estudiante',
  standalone: true,
  templateUrl: './menu-estudiante.component.html',
  styleUrls: ['./menu-estudiante.component.css'],
  imports: [CommonModule]
})
export class MenuEstudianteComponent implements OnInit {
  id_estudiante: string = '';
  nombres: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  selectedOption: string = 'bienvenida'; // Nueva variable para controlar la vista
  preguntas: Pregunta[] = []; // Definir la propiedad preguntas
  id_test: number = 2; // ID del Test seleccionado
  respuestas: { [key: number]: string } = {}; // Almacenar las respuestas

  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private router: Router,
    private preguntasService: PreguntasService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const userDataString = this.localStorageService.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData && typeof userData === 'object') {
          this.nombres = userData.nombres || '';
          this.apellidoPaterno = userData.apellido_paterno || '';
          this.apellidoMaterno = userData.apellido_materno || '';
          this.id_estudiante = userData.id_estudiante || '';
        } else {
          console.error('Parsed user data is not an object:', userData);
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    } else {
      console.error('No user data found in localStorage');
      // Redirigir al login si no hay datos de usuario
      this.router.navigate(['/login']);
    }
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  responderTest(id_test: number): void {
    this.id_test = id_test;
    if (id_test === 1) {
      this.selectedOption = 'realizar-test-amasc';
    } else if (id_test === 2) {
      this.selectedOption = 'realizar-test-beck';
    } else if (id_test === 3) {
      this.selectedOption = 'realizar-test-zung';
    }

    this.preguntasService.getPreguntasPorTest(this.id_test).subscribe(
      (response: any) => {
        if (response.status_code === 200) {
          this.preguntas = response.data;
        } else {
          console.error('Error fetching questions:', response.msg);
        }
      },
      (error) => {
        console.error('Error fetching questions from service:', error);
      }
    );
  }

  enviarRespuestas(event: Event): void {
    event.preventDefault(); // Evitar el redireccionamiento
    const respuestasArray = Object.keys(this.respuestas).map((key: any) => ({
      id_pregunta: Number(key),
      texto_respuesta: this.respuestas[Number(key)]
    }));

    const id_estudiante_num = Number(this.id_estudiante); // Convertir id_estudiante a número

    this.preguntasService.enviarRespuestas(id_estudiante_num, this.id_test, respuestasArray).subscribe(
      response => {
        if (response.status_code === 201) {
          this.mensajeExito = 'Respuestas enviadas correctamente';
          this.mensajeError = '';
        } else {
          this.mensajeError = 'Error: No se pudo enviar el test';
          this.mensajeExito = '';
          console.error('Error sending responses:', response.msg);
        }
      },
      error => {
        this.mensajeError = 'Error: No se pudo enviar el test';
        this.mensajeExito = '';
        console.error('Error sending responses:', error);
      }
    );
  }

  registrarRespuesta(id_pregunta: number, texto_respuesta: string): void {
    this.respuestas[id_pregunta] = texto_respuesta;
  }
}
