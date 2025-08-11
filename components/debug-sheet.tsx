"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function DebugSheet() {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Debug Sheet Component</h2>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" onClick={() => console.log("Trigger clicked")}>
            <Menu className="h-4 w-4 mr-2" />
            Open Sheet (Debug)
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Debug Sheet</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <p>Sheet is working!</p>
            <Button onClick={() => setOpen(false)} className="mt-4">
              Close Sheet
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <p className="mt-2 text-sm text-gray-600">Sheet state: {open ? "Open" : "Closed"}</p>
    </div>
  )
}
