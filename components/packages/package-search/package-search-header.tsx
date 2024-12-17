interface PackageSearchHeaderProps {
  searchParams: {
    code?: string;
    typeSlug?: string;
    search?: string;
  };
}

export function PackageSearchHeader({ searchParams }: PackageSearchHeaderProps) {
  const getTitle = () => {
    if (searchParams.code) return `Resultados para código: ${searchParams.code}`;
    if (searchParams.search) return `Resultados para: ${searchParams.search}`;
    return "Pesquisa de Pacotes";
  };

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold">{getTitle()}</h1>
      <p className="text-lg text-muted-foreground mt-2">
        Encontre o destino perfeito para sua próxima aventura
      </p>
    </div>
  );
}