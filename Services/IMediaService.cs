using System.Collections.Generic;
using System.Threading.Tasks;
using BlazorPWA.Components;

namespace BlazorPWA.Services
{
    public interface IMediaService
    {
        Task<List<MediaItem>> GetAllAsync();
        Task<MediaItem?> GetByIdAsync(string id);
        // Grouped by collection name (collection -> list of media items)
        Task<Dictionary<string, List<MediaItem>>> GetAllGroupedByCollectionAsync();

        // Load collections.json and return mapping of collection id -> collection model
        Task<List<CollectionModel>> GetCollectionsAsync();
        /// <summary>
        /// Forces reload of media.json from the server and updates the internal cache.
        /// </summary>
        Task RefreshAsync();
    }
}
