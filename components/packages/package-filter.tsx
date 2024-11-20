"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Search, SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PackageType } from "@prisma/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { NumericFormat } from "react-number-format";

interface PackageFilterProps {
  packageTypes: PackageType[];
}

export function PackageFilter({ packageTypes }: PackageFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [typeId, setTypeId] = useState(searchParams.get("typeId") || "");
  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [description, setDescription] = useState(searchParams.get("description") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [maxGuests, setMaxGuests] = useState(searchParams.get("maxGuests") || "");
  const [dormitories, setDormitories] = useState(searchParams.get("dormitories") || "");
  const [suites, setSuites] = useState(searchParams.get("suites") || "");
  const [bathrooms, setBathrooms] = useState(searchParams.get("bathrooms") || "");

  const handleFilter = () => {
    const params = new URLSearchParams();
    
    if (code) params.set("code", code);
    if (typeId && typeId !== "ALL") params.set("typeId", typeId);
    if (title) params.set("title", title);
    if (description) params.set("description", description);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (maxGuests) params.set("maxGuests", maxGuests);
    if (dormitories) params.set("dormitories", dormitories);
    if (suites) params.set("suites", suites);
    if (bathrooms) params.set("bathrooms", bathrooms);

    router.push(`/pacotes?${params.toString()}`);
  };

  const clearFilters = () => {
    setCode("");
    setTypeId("");
    setTitle("");
    setDescription("");
    setMinPrice("");
    setMaxPrice("");
    setStartDate("");
    setEndDate("");
    setMaxGuests("");
    setDormitories("");
    setSuites("");
    setBathrooms("");
    router.push("/pacotes");
  };

  return (
    <div className="bg-background rounded-lg shadow-md p-6 space-y-6 border">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          Filtrar Pacotes
        </h2>
        <Button variant="ghost" onClick={clearFilters}>
          Limpar Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <Label htmlFor="code">Código</Label>
          <Input
            id="code"
            placeholder="Buscar por código..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Pacote</Label>
          <Select value={typeId} onValueChange={setTypeId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              {packageTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            placeholder="Buscar por título..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Input
            id="description"
            placeholder="Buscar na descrição..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Faixa de Preço</Label>
          <div className="flex gap-4">
            <NumericFormat
              customInput={Input}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              placeholder="Preço mínimo"
              value={minPrice}
              onValueChange={(values) => setMinPrice(values.value)}
            />
            <NumericFormat
              customInput={Input}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              placeholder="Preço máximo"
              value={maxPrice}
              onValueChange={(values) => setMaxPrice(values.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="w-full"
        >
          {showAdvancedFilters ? "Ocultar" : "Mostrar"} filtros avançados
        </Button>
      </div>

      <div
        className={cn(
          "grid gap-6 transition-all",
          showAdvancedFilters
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data Inicial</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data Final</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxGuests">Hóspedes (mín.)</Label>
              <Input
                id="maxGuests"
                type="number"
                min="1"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dormitories">Dormitórios (mín.)</Label>
              <Input
                id="dormitories"
                type="number"
                min="1"
                value={dormitories}
                onChange={(e) => setDormitories(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="suites">Suítes (mín.)</Label>
              <Input
                id="suites"
                type="number"
                min="1"
                value={suites}
                onChange={(e) => setSuites(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Banheiros (mín.)</Label>
              <Input
                id="bathrooms"
                type="number"
                min="1"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleFilter} className="w-full md:w-auto">
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
}