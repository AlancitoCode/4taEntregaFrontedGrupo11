import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly BASE_URL: string = 'http://localhost:5000';

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  login(correo: string, contraseña: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/estudiantes/v1/login`, { correo, contraseña }).pipe(
      map((response: any) => {
        if (response && response.userData) {
          this.localStorageService.setItem('userData', JSON.stringify(response.userData));
        }
        return response;
      })
    );
  }
}


