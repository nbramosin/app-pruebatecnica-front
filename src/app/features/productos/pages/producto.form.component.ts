import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule} from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ProductoService } from '../services/producto.service';
import { take } from 'rxjs/operators';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { PERU_DATE_FORMAT } from '../../../utils/date-format';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    standalone: true,
    selector: 'app-producto-form',
    templateUrl: './producto.form.component.html',
    styleUrls: ['./producto.form.component.css'],
    imports:[ CommonModule, 
            MatTableModule, 
            MatToolbarModule, 
            MatButtonModule, 
            MatIconModule, 
            MatCardModule, 
            MatFormFieldModule,
            MatInputModule, 
            MatDividerModule,
            FormsModule,
            ReactiveFormsModule,
            MatDatepickerModule
    ],
    providers: [
    provideMomentDateAdapter(PERU_DATE_FORMAT),
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
  ]
})
export class ProductoFormComponent {
    formDatosProd!: FormGroup;
    today = new Date();

    constructor
    (
        private productoService: ProductoService, 
        private fb: FormBuilder, 
        private ngZone: NgZone, 
        private router: Router
    )
    {
        this.formDatosProd = this.fb.group({
            nombreFormControl:['',
                [Validators.required
                //Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
            ]],

            precioFormControl:['',[
                Validators.required,
                Validators.min(0.01),
                Validators.pattern(/^\d+(\.\d{1,2})?$/)
                ]
            ],

            fechaCreacionFormControl:['',
                [Validators.required, this.FechaPasadaValidator]
            ]
        })
    }


    limpiarCampo(control: string){
        this.formDatosProd.get(control)?.setValue('',)
        this.formDatosProd.get(control)?.markAsPristine();
        this.formDatosProd.get(control)?.markAsUntouched();
    }

    crearProducto(){
        if(this.formDatosProd.invalid){
            this.formDatosProd.markAllAsTouched();
            this.ngZone.onStable.pipe(take(1)).subscribe(() => {
                const firstError = document.querySelector('.mat-form-field-invalid');
                firstError?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            });
            Swal.fire({
                icon: 'warning',
                title: 'Formulario incompleto',
                text: 'Por favor completa todos los campos obligatorios',
                confirmButtonColor: '#1976d2'
            });
            return;
        }

         Swal.fire({
            title: '¿Deseas guardar el producto?',
            text: 'Se registrará en la base de datos',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#1976d2'
        }).then((result) => {
            if (!result.isConfirmed) return;

            //Preparar producto request
            const request = {
                nombre: this.formDatosProd.value.nombreFormControl,
                precio: this.formDatosProd.value.precioFormControl,
                fechaCreacion: this.formDatosProd.value.fechaCreacionFormControl,
            };
            console.log("Producto request: ", request)

            this.productoService.crearProducto(request).subscribe({
                next: (data) => {
                    console.log("Registro producto", data);

                    //Lo que me devuelve el servicio
                    if(data.header.codigoRetorno == 0){
                         Swal.fire({
                            icon: 'success',
                            title: 'Producto registrado',
                            text: data.header.descRetorno,
                            timer: 1500,
                            showConfirmButton: false
                        });
                        this.limpiarFormProd();

                        setTimeout(() => {
                            this.router.navigate(['/producto/lista']);
                        }, 1500);
                        
                    }else{
                        Swal.fire({
                            icon: 'warning',
                            title: 'No se pudo registrar',
                            text: data.header.descRetorno || 'Error en el registro'
                        });
                    }
                },
                error: (err) => {
                    console.error(err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error del servidor',
                        text: 'Ocurrió un problema al registrar el producto'
                    });
                }
            })
        })  
    }

    FechaPasadaValidator(control: AbstractControl): ValidationErrors | null {
        const fecha = control.value;

        if (!fecha) return null;

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const input = new Date(fecha);
        input.setHours(0, 0, 0, 0);

        return input < hoy
        ? { fechaPasada: true }
        : null;
    }

    limpiarFormProd(){
         const form = this.formDatosProd.controls;
         form['nombreFormControl'].reset('');
         form['precioFormControl'].reset('');
         form['fechaCreacionFormControl'].reset('');
    }
}