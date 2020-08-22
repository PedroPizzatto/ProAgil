using System.Threading.Tasks;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public interface IProAgilRepository
    {
        //GERAL
         void Add<T>(T entity) where T : class;
         void Update<T>(T entity) where T : class;
         void Delete<T>(T entity) where T : class;
         void DeleteRange<T>(T[] entity) where T : class;
         Task<bool> SaveChangesAsync();

         //EVENTO
         Task<Evento[]> GetAllEventosAsyncByTema(string tema, bool includePalestrantes);
         Task<Evento[]> GetAllEventosAsync(bool includePalestrantes);
         Task<Evento> GetAllEventosAsyncById(int EventoId, bool includePalestrantes);

         //PALESTRANTE
         Task<Palestrante> GetPalestrantesAsync(int PalestranteId, bool includeEventos);
         Task<Palestrante[]> GetAllPalestrantesAsyncByName(string name, bool includeEventos);
    }
}