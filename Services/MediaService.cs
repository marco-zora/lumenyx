using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using BlazorPWA.Components;

namespace BlazorPWA.Services
{
    public class MediaService : IMediaService
    {
        private readonly HttpClient _http;
        private List<MediaItem> _cache = new();
        private bool _loaded = false;

        public MediaService(HttpClient http)
        {
            _http = http;
        }

        public async Task<List<MediaItem>> GetAllAsync()
        {
            if (!_loaded)
            {
                await EnsureLoadedAsync();
            }
            return _cache;
        }

        public async Task<MediaItem?> GetByIdAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return null;
            if (!_loaded)
            {
                await EnsureLoadedAsync();
            }
            return _cache.FirstOrDefault(x => x.Id == id);
        }

        public async Task RefreshAsync()
        {
            await EnsureLoadedAsync(force: true);
        }

        public async Task<Dictionary<string, List<MediaItem>>> GetAllGroupedByCollectionAsync()
        {
            var all = await GetAllAsync();
            // Group by collection; empty collection goes to 'Uncategorized'
            var groups = all.GroupBy(m => string.IsNullOrWhiteSpace(m.Collection) ? "Uncategorized" : m.Collection)
                             .ToDictionary(g => g.Key, g => g.ToList());
            return groups;
        }

        private async Task EnsureLoadedAsync(bool force = false)
        {
            if (_loaded && !force) return;

            // Add a cache-busting query parameter to ensure the browser fetches latest file
            var url = "media/media.json";
            if (force)
            {
                var ts = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
                url = $"media/media.json?ts={ts}";
            }

            var media = await _http.GetFromJsonAsync<List<MediaItem>>(url);
            _cache = media ?? new List<MediaItem>();
            _loaded = true;
        }
    }
}
