using LAMA_API.Models;
using LAMA_API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LAMA_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MiembrosController : ControllerBase
    {
        private readonly FirestoreService _firestoreService;

        public MiembrosController(FirestoreService firestoreService)
        {
            _firestoreService = firestoreService;
        }

        // 🔹 GET: Solo obtiene los miembros del usuario autenticado
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = HttpContext.Items["UserId"]?.ToString();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { mensaje = "Usuario no autenticado" });

            var miembros = await _firestoreService.GetAllByUserAsync(userId);
            return Ok(miembros);
        }

        // 🔹 POST: Agrega miembro y asocia el UserId automáticamente
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Miembro miembro)
        {
            var userId = HttpContext.Items["UserId"]?.ToString();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { mensaje = "Usuario no autenticado" });

            miembro.UserId = userId; // 🔸 Se asigna automáticamente
            var nuevo = await _firestoreService.AddAsync(miembro);
            return Ok(nuevo);
        }

        // 🔹 PUT: Solo permite actualizar miembros del mismo usuario
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] Miembro miembro)
        {
            var userId = HttpContext.Items["UserId"]?.ToString();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { mensaje = "Usuario no autenticado" });

            var existente = await _firestoreService.GetByIdAsync(userId, id);
            if (existente == null || existente.UserId != userId)
                return Forbid(); // No puede editar otros usuarios

            miembro.UserId = userId;
            await _firestoreService.UpdateAsync(userId, id, miembro);
            return Ok(new { mensaje = "Miembro actualizado correctamente." });
        }

        // 🔹 DELETE: Solo elimina miembros del usuario autenticado
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var userId = HttpContext.Items["UserId"]?.ToString();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { mensaje = "Usuario no autenticado" });

            var existente = await _firestoreService.GetByIdAsync(userId, id);
            if (existente == null || existente.UserId != userId)
                return Forbid();

            await _firestoreService.DeleteAsync(userId, id);
            return Ok(new { mensaje = "Miembro eliminado correctamente." });
        }
    }
}
