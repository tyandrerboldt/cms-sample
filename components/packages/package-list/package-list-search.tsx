import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect } from "react";

interface PackageListSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  debouncedSearch: string;
}

export function PackageListSearch({
  value,
  onChange,
  onSearch,
  debouncedSearch,
}: PackageListSearchProps) {
  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  return (
    <div className="bg-background rounded-lg shadow-md p-6 space-y-6 border mb-8">
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            className="pl-9"
            placeholder="Busque por nome, rio, UF do estado, código, etc..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}