import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = "Subir imagen",
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      // Resize to max 1200px
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        onChange(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) processFile(file);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {value ? (
        <div className="relative inline-block group">
          <img
            src={value}
            alt="Vista previa"
            className="max-h-44 max-w-sm rounded-lg border border-border object-cover shadow-sm"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors shadow-md"
            title="Eliminar imagen"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all",
          dragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processFile(file);
            e.target.value = "";
          }}
        />
        <div className="flex flex-col items-center gap-2">
          {value ? (
            <>
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">
                Cambiar imagen
              </span>
            </>
          ) : (
            <>
              <ImageIcon className="h-9 w-9 text-muted-foreground/50" />
              <span className="text-sm font-medium text-muted-foreground">
                {label}
              </span>
              <span className="text-xs text-muted-foreground/60">
                Haz clic o arrastra una foto aquí · JPG, PNG, WEBP
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
