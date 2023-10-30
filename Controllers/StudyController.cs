using Microsoft.AspNetCore.Mvc;

namespace WebAppsKF.Controllers
{
    public class StudyController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
