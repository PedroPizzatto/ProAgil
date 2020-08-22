using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;
using ProAgil.WebAPI.Dtos;

namespace ProAgil.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {
        private readonly IProAgilRepository _repository;
        private readonly IMapper _mapper;
        public EventoController(IProAgilRepository repository, IMapper mapper)
        {
            _mapper = mapper;
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await _repository.GetAllEventosAsync(true);

                var results = _mapper.Map<EventoDto[]>(eventos);

                return Ok(results);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco falhou: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var results = await _repository.GetAllEventosAsyncById(id, true);

                return Ok(results);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco falhou");
            }
        }

        [HttpGet("getByTema/{tema}")]
        public async Task<IActionResult> GetByTema(string tema)
        {
            try
            {
                var eventos = await _repository.GetAllEventosAsyncByTema(tema, true);

                var results = _mapper.Map<EventoDto[]>(eventos);

                return Ok(results);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco falhou");
            }
        }

        [HttpPost("uploadImage")]
        public async Task<IActionResult> UploadImage()
        {
            try{
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources","Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(),folderName);

                if (file.Length > 0)
                {
                    var fileName = file.FileName;
                    var fullPath = Path.Combine(pathToSave,fileName);
                    using (var stream = new FileStream(fullPath,FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                }

                return Ok();
            } 
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,$"Ocorreu um erro ao fazer upload da imagem {ex}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try
            {
                var evento = _mapper.Map<Evento>(model);
                _repository.Add(evento);

                if (await _repository.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDto>(model));
                }
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco falhou: {ex.Message}");
            }

            return BadRequest();
        }

        [HttpPut("{EventoId}")]
        public async Task<IActionResult> Put(int EventoId, EventoDto model)
        {
            try
            {
                var evento = await _repository.GetAllEventosAsyncById(EventoId, false);
                if (evento == null) return NotFound();

                var idLotes = new List<int>();
                var idRedes = new List<int>();

                model.Lotes.ForEach(lote => idLotes.Add(lote.Id));
                model.RedesSociais.ForEach(rede => idRedes.Add(rede.Id));
                
                var lotes = evento.Lotes.Where(lote => !idLotes.Contains(lote.Id)).ToArray();
                var redesSociais = evento.RedesSociais.Where(rede => !idRedes.Contains(rede.Id)).ToArray();

                if (lotes.Length > 0) _repository.DeleteRange(lotes);
                if (redesSociais.Length > 0) _repository.DeleteRange(redesSociais);

                _mapper.Map(model, evento);

                _repository.Update(evento);

                if (await _repository.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDto>(model));
                }
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

            return BadRequest();
        }

        [HttpDelete("{EventoId}")]
        public async Task<IActionResult> Delete(int EventoId)
        {
            try
            {
                var evento = await _repository.GetAllEventosAsyncById(EventoId, false);
                if (evento == null) return NotFound();

                _repository.Delete(evento);

                if (await _repository.SaveChangesAsync())
                {
                    return Ok();
                }
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco falhou");
            }

            return BadRequest();
        }
    }
}