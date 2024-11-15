"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Search } from "lucide-react";

export function PackageFilter() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search destinations..."
            className="pl-8"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <div className="relative">
          <Calendar className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="date"
            type="date"
            className="pl-8"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="price">Max Price</Label>
        <Input
          id="price"
          type="number"
          placeholder="Enter max price"
        />
      </div>
      <div className="flex items-end">
        <Button className="w-full">Search Packages</Button>
      </div>
    </div>
  );
}