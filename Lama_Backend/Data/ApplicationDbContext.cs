using Microsoft.EntityFrameworkCore;
using LAMA_API.Models;

namespace LAMA_API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
            : base(options) { }

        public DbSet<Miembro> Miembros { get; set; }
    }
}
