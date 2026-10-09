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

        public bool IsSelected { get; set; } = false;
    }

    public class CollectionModel
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<string> Items { get; set; } = new();
    }

}
