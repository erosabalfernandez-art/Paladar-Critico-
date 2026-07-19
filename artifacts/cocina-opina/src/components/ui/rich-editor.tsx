import { useRef, useEffect, useCallback, useState } from "react";
import { Bold, Italic, Underline, ImagePlus, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface RichEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  className?: string;
}

const FONT_SIZES = [
  { label: "Pequeño", px: "12px" },
  { label: "Normal", px: "15px" },
  { label: "Grande", px: "19px" },
  { label: "Muy grande", px: "24px" },
  { label: "Título", px: "30px" },
];

const COLORS = [
  { label: "Negro", value: "#111111" },
  { label: "Gris oscuro", value: "#444444" },
  { label: "Gris", value: "#888888" },
  { label: "Rojo", value: "#dc2626" },
  { label: "Naranja", value: "#ea580c" },
  { label: "Amarillo", value: "#ca8a04" },
  { label: "Verde", value: "#16a34a" },
  { label: "Azul", value: "#2563eb" },
  { label: "Violeta", value: "#9333ea" },
  { label: "Rosa", value: "#db2777" },
  { label: "Marrón", value: "#92400e" },
  { label: "Dorado", value: "#D4AF37" },
];

export function RichEditor({ value = "", onChange, placeholder, minHeight = 140, className }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const skipSync = useRef(false);
  const [colorOpen, setColorOpen] = useState(false);

  // Sync external value changes into the editor
  useEffect(() => {
    const el = editorRef.current;
    if (!el || skipSync.current) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value;
    }
  }, [value]);

  const emit = useCallback(() => {
    skipSync.current = true;
    onChange?.(editorRef.current?.innerHTML ?? "");
    requestAnimationFrame(() => {
      skipSync.current = false;
    });
  }, [onChange]);

  const exec = useCallback(
    (cmd: string, val?: string) => {
      editorRef.current?.focus();
      document.execCommand(cmd, false, val ?? undefined);
      emit();
    },
    [emit]
  );

  const applySize = useCallback(
    (px: string) => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
        // If nothing selected, just focus
        editorRef.current?.focus();
        return;
      }
      const range = sel.getRangeAt(0);
      try {
        const span = document.createElement("span");
        span.style.fontSize = px;
        range.surroundContents(span);
        emit();
      } catch {
        // If range crosses multiple nodes, use execCommand fallback
        const sizeMap: Record<string, string> = {
          "12px": "1",
          "15px": "3",
          "19px": "4",
          "24px": "5",
          "30px": "6",
        };
        exec("fontSize", sizeMap[px] ?? "3");
      }
    },
    [emit, exec]
  );

  const applyColor = useCallback(
    (color: string) => {
      editorRef.current?.focus();
      document.execCommand("foreColor", false, color);
      emit();
      setColorOpen(false);
    },
    [emit]
  );

  const insertImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        // Resize large images to max 900px before inserting
        const img = new Image();
        img.onload = () => {
          const MAX = 900;
          const scale = Math.min(1, MAX / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const resized = canvas.toDataURL("image/jpeg", 0.82);
          editorRef.current?.focus();
          document.execCommand("insertImage", false, resized);
          emit();
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [emit]);

  return (
    <div className={cn("border border-input rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-ring focus-within:border-ring transition-colors", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-muted/50 border-b border-input">
        <ToolBtn onClick={() => exec("bold")} title="Negrita (selecciona texto primero)">
          <Bold className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => exec("italic")} title="Cursiva">
          <Italic className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => exec("underline")} title="Subrayado">
          <Underline className="h-3.5 w-3.5" />
        </ToolBtn>

        <Sep />

        <select
          className="h-7 text-xs border border-input/50 rounded px-1.5 bg-background cursor-pointer outline-none"
          title="Tamaño de letra (selecciona texto primero)"
          onChange={(e) => applySize(e.target.value)}
          value=""
        >
          <option value="" disabled>
            Tamaño...
          </option>
          {FONT_SIZES.map((f) => (
            <option key={f.px} value={f.px}>
              {f.label}
            </option>
          ))}
        </select>

        <Sep />

        {/* Color picker */}
        <div className="relative">
          <ToolBtn
            onClick={() => setColorOpen((v) => !v)}
            title="Color del texto (selecciona texto primero)"
            active={colorOpen}
          >
            <Palette className="h-3.5 w-3.5" />
          </ToolBtn>
          {colorOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setColorOpen(false)} />
              <div className="absolute top-8 left-0 z-50 bg-popover border border-border rounded-lg shadow-lg p-2 grid grid-cols-4 gap-1.5 min-w-[124px]">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    className="h-6 w-6 rounded border border-border/50 hover:scale-110 transition-transform cursor-pointer"
                    style={{ background: c.value }}
                    onClick={() => applyColor(c.value)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <Sep />

        <ToolBtn onClick={insertImage} title="Insertar imagen desde tu ordenador" className="px-2 gap-1.5">
          <ImagePlus className="h-3.5 w-3.5" />
          <span className="text-xs hidden sm:inline">Insertar foto</span>
        </ToolBtn>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className={cn(
          "p-3 outline-none text-sm leading-relaxed break-words",
          "[&_img]:max-w-full [&_img]:rounded [&_img]:my-2 [&_img]:block",
          "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none"
        )}
      />
    </div>
  );
}

function ToolBtn({
  children,
  onClick,
  title,
  className,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
  className?: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "h-7 min-w-7 flex items-center justify-center rounded transition-colors",
        "text-muted-foreground hover:text-foreground hover:bg-muted text-xs",
        active && "bg-muted text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-5 bg-border mx-0.5 shrink-0" />;
}
