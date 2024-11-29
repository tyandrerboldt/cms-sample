"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { PackageType } from "@prisma/client";
import { useDebounce } from "@/hooks/use-debounce";
import { useState, useEffect } from "react";

interface PackageFilterProps {
  packageTypes: PackageType[];
}

export function PackageFilter({ packageTypes }: PackageFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get("code") || "";
  const typeSlug = searchParams.get("typeSlug") || "";
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchInput, 400);

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    if(key === "typeSlug" && value === "ALL"){
      params.delete(key);
    }

    router.push(`/pacotes?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchInput("");
    router.push("/pacotes");
  };

  useEffect(() => {
    if (debouncedSearch !== searchParams.get("search")) {
      handleFilter("search", debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <div className="bg-background rounded-lg shadow-md p-6 space-y-6 border">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtrar Pacotes</h2>
        <Button variant="ghost" onClick={clearFilters}>
          Limpar Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="code">Código</Label>
          <Input
            id="code"
            placeholder="Buscar por código..."
            value={code}
            onChange={(e) => handleFilter("code", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="typeSlug">Tipo de Pacote</Label>
          <Select value={typeSlug} onValueChange={(value) => handleFilter("typeSlug", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              {packageTypes.map((type) => (
                <SelectItem key={type.id} value={type.slug}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              className="pl-9"
              placeholder="Buscar em título, descrição ou localização..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}