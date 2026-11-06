namespace BlazorPWA.Components
{
    public record DeviceItem(
        string Codice,
        string Descrizione,
        string Tipo,
        string Stato,
        string DataUpdate,
        string DataUltimaManutenzione,
        string VideoUrl
    );


    public class InstructionItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Type { get; set; } = "";
        public string? MediaId { get; set; }
        public int DurationSeconds { get; set; } = 5;
        // When true, the instruction component should open its edit menu when rendered
        public bool OpenMenuOnRender { get; set; } = false;
    }

    /// <summary>
    /// Nuova Versione di Istruzione
    /// </summary>
    public class Instruction
    {
        //public Guid Id { get; set; } = Guid.NewGuid();
        public string Type { get; set; } = "";
        public string MediaUrl { get; set; } = string.Empty;
        public int DurationSeconds { get; set; } = 5;
    }

   

    public class CollectionModel
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<string> Items { get; set; } = new();
    }

    public class NextcloudSession
    {
        public bool IsConnected { get; private set; }

        public string Username { get; private set; } = "";
        public string Password { get; private set; } = "";

        public event Action? OnChange;

        public void Connect(string username, string password)
        {
            Username = username;
            Password = password;
            IsConnected = true;

            OnChange?.Invoke();
        }

        public void Disconnect()
        {
            Username = "";
            Password = "";
            IsConnected = false;

            OnChange?.Invoke();
        }
    }

    public class MediaCollection
    {
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public List<MediaItem> Items { get; set; } = new();
    }

   
    public class MediaItem
    {
        public string Id { get; set; } = "";
        public string Type { get; set; } = "";
        public string Name { get; set; } = "";
        public string Url { get; set; } = "";
        public string ThumbnailUrl { get; set; } = string.Empty;
        public double DurationSeconds { get; set; }
        // New: collection/grouping for library rows (e.g. "Trending", "Recommended")
        //public string Collection { get; set; } = "";
        public string ContentType { get; set; } = "";
        public long Size { get; set; }
        public bool IsSelected { get; set; } = false;
    }
    public interface ICloudStorage
    {
        Task<List<MediaCollection>> GetCollectionsAsync();

        Task<List<MediaItem>> GetMediaAsync(string collectionId);
    }
}
