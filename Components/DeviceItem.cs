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
    
}
