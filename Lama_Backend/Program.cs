using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using LAMA_API.Middleware;
using LAMA_API.Services;

var builder = WebApplication.CreateBuilder(args);

var replitDomain = Environment.GetEnvironmentVariable("REPLIT_DEV_DOMAIN");
var allowedOrigins = new List<string>
{
    "http://localhost:3000",
    "http://localhost:5000",
    "https://lama-medellin.web.app",
    "https://lama-medellin.firebaseapp.com"
};

if (!string.IsNullOrEmpty(replitDomain))
{
    allowedOrigins.Add($"https://{replitDomain}");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(allowedOrigins.ToArray())
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

var serviceAccountPath = Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS")
                            ?? "Lama_Backend/firebase-key.json";

if (File.Exists(serviceAccountPath))
{
    if (FirebaseApp.DefaultInstance == null)
    {
        FirebaseApp.Create(new AppOptions
        {
            Credential = GoogleCredential.FromFile(serviceAccountPath)
        });
    }
}
else
{
    Console.WriteLine($"Warning: Firebase credentials not found at {serviceAccountPath}. Some features may not work.");
}

var app = builder.Build();

// 🔹 Swagger (solo desarrollo)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");
app.UseFirebaseAuth();
app.MapControllers();

app.MapGet("/api/private/test", (HttpContext context) =>
{
    var uid = context.Items["UserId"]?.ToString();
    return uid is null ? Results.Unauthorized() : Results.Ok($"Usuario autenticado: {uid}");
});

app.Run();
