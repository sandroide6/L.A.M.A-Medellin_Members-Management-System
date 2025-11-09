using Google.Cloud.Firestore;
using LAMA_API.Models;
using Microsoft.AspNetCore.Http;

namespace LAMA_API.Services
{
    public class FirestoreService
    {
        private readonly FirestoreDb _firestoreDb;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public FirestoreService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;

            // 🔹 Cargar credenciales de Firebase (asegúrate que la ruta exista en el despliegue)
            string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "firebase-key.json");
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);

            _firestoreDb = FirestoreDb.Create("lama-medellin");
        }

        // -----------------------
        // Helpers
        // -----------------------

        private string? GetUserId()
        {
            return _httpContextAccessor.HttpContext?.Items["UserId"]?.ToString();
        }

        private CollectionReference GetUserCollection(string userId)
        {
            if (string.IsNullOrEmpty(userId))
                throw new ArgumentNullException(nameof(userId));

            return _firestoreDb
                .Collection("users")
                .Document(userId)
                .Collection("miembros");
        }

        private void NormalizeDates(Miembro miembro)
        {
            DateTime Safe(DateTime? d) => d ?? DateTime.UtcNow;

            if (miembro.FechaIngreso != default)
                miembro.FechaIngreso = Safe(miembro.FechaIngreso).ToUniversalTime();

            if (miembro.FechaNacimiento != default)
                miembro.FechaNacimiento = Safe(miembro.FechaNacimiento).ToUniversalTime();

            if (miembro.FechaExpedicionLicenciaConduccion != default)
                miembro.FechaExpedicionLicenciaConduccion = Safe(miembro.FechaExpedicionLicenciaConduccion).ToUniversalTime();

            if (miembro.FechaExpedicionSOAT != default)
                miembro.FechaExpedicionSOAT = Safe(miembro.FechaExpedicionSOAT).ToUniversalTime();
        }

        // -----------------------
        // API pública usada por el controller
        // -----------------------

        public async Task<List<Miembro>> GetAllByUserAsync(string? userId = null)
        {
            userId ??= GetUserId();
            if (string.IsNullOrEmpty(userId)) throw new UnauthorizedAccessException("Usuario no autenticado");

            var snapshot = await GetUserCollection(userId).GetSnapshotAsync();

            return snapshot.Documents
                .Where(d => d.Exists)
                .Select(d =>
                {
                    var miembro = d.ConvertTo<Miembro>();
                    miembro.Id = d.Id;
                    miembro.UserId ??= userId;
                    return miembro;
                })
                .ToList();
        }

        public async Task<Miembro?> GetByIdAsync(string? userId, string id)
        {
            userId ??= GetUserId();
            if (string.IsNullOrEmpty(userId)) throw new UnauthorizedAccessException("Usuario no autenticado");

            var docRef = GetUserCollection(userId).Document(id);
            var snap = await docRef.GetSnapshotAsync();
            if (!snap.Exists) return null;

            var miembro = snap.ConvertTo<Miembro>();
            miembro.Id = snap.Id;
            miembro.UserId ??= userId;
            return miembro;
        }

        public async Task<Miembro> AddAsync(Miembro miembro)
        {
            miembro.UserId ??= GetUserId();
            if (string.IsNullOrEmpty(miembro.UserId))
                throw new UnauthorizedAccessException("Usuario no autenticado");

            NormalizeDates(miembro);

            var docRef = await GetUserCollection(miembro.UserId).AddAsync(miembro);
            miembro.Id = docRef.Id;
            return miembro;
        }

        public async Task UpdateAsync(string? userId, string id, Miembro miembro)
        {
            userId ??= GetUserId();
            if (string.IsNullOrEmpty(userId))
                throw new UnauthorizedAccessException("Usuario no autenticado");

            NormalizeDates(miembro);
            miembro.Id = id;
            miembro.UserId = userId;

            var docRef = GetUserCollection(userId).Document(id);
            await docRef.SetAsync(miembro, SetOptions.Overwrite);
        }

        public async Task DeleteAsync(string? userId, string id)
        {
            userId ??= GetUserId();
            if (string.IsNullOrEmpty(userId))
                throw new UnauthorizedAccessException("Usuario no autenticado");

            var docRef = GetUserCollection(userId).Document(id);
            await docRef.DeleteAsync();
        }
    }
}
