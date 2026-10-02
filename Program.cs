using BlazorPWA;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
// MediaService provides centralized access to wwwroot/media/media.json
builder.Services.AddScoped<BlazorPWA.Services.IMediaService, BlazorPWA.Services.MediaService>();

await builder.Build().RunAsync();
