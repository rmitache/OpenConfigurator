﻿
using Microsoft.AspNetCore.Mvc;

namespace OpenConfigurator.WebUI.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class ApiControllerBase : ControllerBase
{
    //private ISender _mediator = null!;

    //protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();
}
