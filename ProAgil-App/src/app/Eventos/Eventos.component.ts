import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})

export class EventosComponent implements OnInit {
  dataEvento: any;
  titulo = 'Eventos';
  eventos: Evento[];
  evento: Evento;
  modoSalvar = '';
  imagemAltura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup;
  // tslint:disable-next-line: variable-name
  _eventosFiltrados: Evento[];
  // tslint:disable-next-line: variable-name
  _filtroLista: string;
  headerTextDelete = '';
  file: File;
  dataAtual: string;
  bodyDeletarEvento = '';
  fileNameToUpdate: string;

  constructor(private eventoService: EventoService,
              private formBuilder: FormBuilder,
              private localeService: BsLocaleService,
              private toastr: ToastrService) {
    this.localeService.use('pt-br');
  }

  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEvento(this.filtroLista) : this.eventos;
  }

  get eventosFiltrados(): Evento[] {
    return this._eventosFiltrados ? this._eventosFiltrados : this.eventos ;
  }

  set eventosFiltrados(value: Evento[]) {
    this._eventosFiltrados = value;
  }

  ngOnInit() {
    this.validation();
    this.dataAtual = new Date().getMilliseconds().toString();
    this.getEventos();
  }

  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }

  filtrarEvento(filtroLista: string): Evento[] {
    filtroLista = filtroLista.toLocaleLowerCase();
    return this.eventos.filter(evento => evento.tema.toLocaleLowerCase().indexOf(filtroLista) !== -1);
  }

  getEventos() {
    this.dataAtual = new Date().getMilliseconds().toString();
    this.eventoService.getAllEvento().subscribe(
      (events: Evento[]) => {
        this.eventos = events;
      },
      error => {
        this.toastr.error(`Ocorreu um erro ao carregar eventos: ${error.error}`);
      }
    );
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  uploadImagem() {
    if (this.modoSalvar === 'post') {
      const nomeArquivo = this.evento.imagemURL.split('\\', 3);
      this.evento.imagemURL = nomeArquivo[2];

      this.eventoService.postUpload(this.file, nomeArquivo[2]).subscribe(
        () => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        }
      );
    } else {
      this.evento.imagemURL = this.fileNameToUpdate;
      this.eventoService.postUpload(this.file, this.fileNameToUpdate).subscribe(
        () => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        }
      );
    }
  }

  salvarAlteracao(template: any) {
    if (this.registerForm.valid) {

      if (this.modoSalvar === 'put') {
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
            this.toastr.success('Salvo com sucesso!');
          }, error => {
            this.toastr.error(`Ocorreu um erro ao tentar salvar evento: ${error.error}`);
          }
        );
      } else if (this.modoSalvar === 'post') {
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.postEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
            this.toastr.success('Salvo com sucesso!');
          }, error => {
            this.toastr.error(`Ocorreu um erro ao tentar salvar evento: ${error.error}`);
          }
        );
      }
    }
  }

  novoEvento(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  editarEvento(evento: Evento, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.fileNameToUpdate = evento.imagemURL.toString();
    this.evento.imagemURL = '';
    this.registerForm.patchValue(this.evento);
  }

  excluirEvento(evento: Evento, confirm: any) {
    this.headerTextDelete = evento.tema;
    confirm.show();
    this.evento = evento;
  }

  confirmaExclusao(confirm: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
        confirm.hide();
        this.getEventos();
        this.toastr.success('Excluido com sucesso!');
      },
      (error) => {
        this.toastr.error(`Ocorreu um erro ao tentar excluir o evento: ${error.error}`);
      }
    );
  }

  validation() {
    this.registerForm = this.formBuilder.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      qtdPessoas: ['', [Validators.required, Validators.max(1000)]],
      imagemURL: ['', Validators.required]
    });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
    }
  }

}
