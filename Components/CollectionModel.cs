namespace BlazorPWA.Components
{
    public class CollectionModel
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<string> Items { get; set; } = new();
    }
}
