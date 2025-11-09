FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /app/published

FROM base AS final
WORKDIR /app
COPY --from=build /app/published .
ENTRYPOINT ["dotnet", "LAMA_API.dll"]
