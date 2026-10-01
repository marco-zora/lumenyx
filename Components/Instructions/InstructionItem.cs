namespace BlazorPWA.Components.Instructions;

public class InstructionItem
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Type { get; set; } = "";

    public string? MediaId { get; set; }

    public int DurationSeconds { get; set; } = 5;
}