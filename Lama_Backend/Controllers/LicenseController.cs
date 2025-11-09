using Lama_Backend.Service;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Lama_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LicenseController : ControllerBase
    {
        private readonly LicenseService _licenseService;

        public LicenseController()
        {
            _licenseService = new LicenseService();
        }

        [HttpPost("generate")]
        public async Task<IActionResult> Generate(string userId, string plan)
        {
            var license = await _licenseService.GenerateLicense(userId, plan);
            return Ok(new { license });
        }

        [HttpGet("validate")]
        public async Task<IActionResult> Validate(string userId)
        {
            bool isValid = await _licenseService.ValidateLicense(userId);
            return Ok(new { isValid });
        }
    }
}
