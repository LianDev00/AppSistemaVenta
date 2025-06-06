import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {
  columnasTabla: string[] = ['nombreCompleto', 'correo', 'rolDescripcion', 'estado', 'acciones']
  dataInicio: Usuario[] = []
  dataListaUsuarios = new MatTableDataSource(this.dataInicio)
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator

  constructor(
    private dialog: MatDialog,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) { }

  obtenerUsuarios(){

    this._usuarioServicio.lista().subscribe({
      next: (data) => {
        if(data.status) 
          this.dataListaUsuarios.data = data.value;
        else
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!")
      },
      error: (e) => {}
    })
  }

  ngOnInit(): void {
    this.obtenerUsuarios()
  }

  ngAfterViewInit(): void{
    this.dataListaUsuarios.paginator = this.paginacionTabla
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataListaUsuarios.filter = filterValue.trim().toLowerCase()
  }

  nuevoUsuario(){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.obtenerUsuarios()
    })
  }

  editarUsuario(usuario: Usuario){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.obtenerUsuarios()
    })
  }

  eliminarUsuario(usuario: Usuario){
    Swal.fire({
      title: "¿Desea eliminar el usuario?",
      text: usuario.nombreCompleto,
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "No, volver"
    }).then((resultado) => {
      if(resultado.isConfirmed){
        this._usuarioServicio.eliminar(usuario.idUsuario).subscribe({
          next:(data) => {
            if(data.status){
              this._utilidadServicio.mostrarAlerta("El usuario ha sido eliminado","Listo!")
              this.obtenerUsuarios()
            } else{
              this._utilidadServicio.mostrarAlerta("El usuario no pudo ser eliminado","Error")
            }
          },
          error:(e) => {}
        })
      }
    })
  }
}
