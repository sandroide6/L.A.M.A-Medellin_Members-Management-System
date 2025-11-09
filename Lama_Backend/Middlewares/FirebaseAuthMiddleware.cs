using FirebaseAdmin.Auth;

namespace LAMA_API.Middleware
{
    public class FirebaseAuthMiddleware
    {
        private readonly RequestDelegate _next;

        public FirebaseAuthMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            string? authHeader = context.Request.Headers["Authorization"];

            // Si no hay token, se permite continuar (por si el endpoint no requiere auth)
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                await _next(context);
                return;
            }

            var token = authHeader.Substring("Bearer ".Length).Trim();

            try
            {
                // ✅ Verificar token con Firebase
                FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);
                string uid = decodedToken.Uid;

                // Guardar UID en HttpContext
                context.Items["UserId"] = uid;
                context.Items["FirebaseUserId"] = uid;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error verificando token Firebase: {ex.Message}");
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Token inválido o expirado.");
                return;
            }

            await _next(context);
        }
    }

    // ✅ Extension method opcional
    public static class FirebaseAuthMiddlewareExtensions
    {
        public static IApplicationBuilder UseFirebaseAuth(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<FirebaseAuthMiddleware>();
        }
    }
}
