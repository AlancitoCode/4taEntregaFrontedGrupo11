import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Asegúrate de que este módulo esté importado
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PortalComponent } from './portal/portal.component';
import { MenuComponent } from './menu/menu.component';
import { UserSelectionComponent } from './user-selection/user-selection.component';
import { LoginComponent } from './login/login.component';
import { MenuEstudianteComponent } from './menu-estudiante/menu-estudiante.component';
import { LocalStorageService } from './service/local-storage.service'; // Importar el servicio

import { PreguntasService } from './service/preguntas.service';

const routes: Routes = [
  { path: '', component: PortalComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'user-selection', component: UserSelectionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'menu-estudiante', component: MenuEstudianteComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    PortalComponent,
    MenuComponent,
    UserSelectionComponent,
    LoginComponent,
    MenuEstudianteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, // Asegúrate de que este módulo esté importado aquí
    RouterModule.forRoot(routes)
  ],
  providers: [LocalStorageService], // Asegurarse de que el servicio esté proporcionado
  bootstrap: [AppComponent]
})
export class AppModule { }
