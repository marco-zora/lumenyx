using System.Collections.Generic;
using System.Threading.Tasks;
using BlazorPWA.Components;

namespace BlazorPWA.Services
{
    public interface IMediaService
    {
        Task<List<MediaItem>> GetAllAsync();
        Task<MediaItem?> GetByIdAsync(string id);
        /// <summary>
        /// Forces reload of media.json from the server and updates the internal cache.
        /// </summary>
        Task RefreshAsync();
    }
}
