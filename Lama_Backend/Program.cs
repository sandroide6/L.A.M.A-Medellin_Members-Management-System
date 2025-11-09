using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using LAMA_API.Middleware;
using LAMA_API.Services;

var builder = WebApplication.CreateBuilder(args);

// 🔹 CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:3001",
            "https://lama-medellin.web.app",
            "https://lama-medellin.firebaseapp.com"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

// 🔹 Controladores + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔹 FirestoreService + HttpContextAccessor
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<FirestoreService>(provider =>
{
    var httpContextAccessor = provider.GetRequiredService<IHttpContextAccessor>();
    return new FirestoreService(httpContextAccessor);
});

// 🔹 Firebase credentials
var serviceAccountPath = Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS")
                            ?? "/etc/secrets/firebase-key.json";

if (!File.Exists(serviceAccountPath))
{
    throw new FileNotFoundException($"No se encontró la clave de Firebase: {serviceAccountPath}");
}

if (FirebaseApp.DefaultInstance == null)
{
    FirebaseApp.Create(new AppOptions
    {
        Credential = GoogleCredential.FromFile(serviceAccountPath)
    });
}

var app = builder.Build();

// 🔹 Swagger (solo desarrollo)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 🔹 Middlewares
app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseFirebaseAuth();
app.MapControllers();

// 🔹 Ruta privada de prueba
app.MapGet("/api/private/test", (HttpContext context) =>
{
    var uid = context.Items["UserId"]?.ToString();
    return uid is null ? Results.Unauthorized() : Results.Ok($"Usuario autenticado: {uid}");
});

app.Run();
