"use client";

import type { KeyboardEvent } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

type SearchableSelectOption = {
  value: string;
  label: string;
  meta?: string;
  disabled?: boolean;
};

type SearchableSelectProps = {
  label?: string;
  value: string;
  onChange: (next: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  helperText?: string;
  error?: string;
};

export function SearchableSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select…",
  loading = false,
  disabled = false,
  helperText,
  error,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxId = useId();
  const labelText = typeof label === "string" ? label.trim() : "";
  const searchPlaceholder = labelText ? `Search ${labelText.toLowerCase()}...` : "Search options...";

  const selectedOption = options.find((option) => option.value === value);
  const filteredOptions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((option) => `${option.label} ${option.meta ?? ""}`.toLowerCase().includes(needle));
  }, [options, query]);

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    setActiveIndex((current) => {
      if (!filteredOptions.length) return 0;
      const selectedIndex = filteredOptions.findIndex((option) => option.value === value);
      if (selectedIndex >= 0) return selectedIndex;
      return Math.min(current, filteredOptions.length - 1);
    });
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [filteredOptions, open, value]);

  const selectOption = (option: SearchableSelectOption) => {
    if (option.disabled) return;
    onChange(option.value);
    setOpen(false);
    setQuery("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (!filteredOptions.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, filteredOptions.length - 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const option = filteredOptions[activeIndex];
      if (option) {
        selectOption(option);
      }
    }
  };

  return (
    <div ref={rootRef} className="relative">
      {labelText && <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">{labelText}</label>}
      <button
        type="button"
        disabled={disabled}
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => {
          if (disabled) return;
          setQuery("");
          setOpen((current) => !current);
        }}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm text-slate-800 shadow-sm transition hover:border-amber-300 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
      >
        <span className={`truncate ${selectedOption ? "font-semibold" : "text-slate-400"}`}>
          {selectedOption?.label || placeholder}
        </span>
        <span className="shrink-0 text-slate-400">▾</span>
      </button>

      {helperText && !error && <div className="mt-1 text-[11px] text-slate-400">{helperText}</div>}
      {error && <div className="mt-1 text-[11px] font-medium text-rose-600">{error}</div>}

      {open && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-100 p-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={onKeyDown}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
            />
          </div>
          <div id={listboxId} role="listbox" className="max-h-64 overflow-auto p-1">
            {loading ? (
              <div className="px-3 py-6 text-center text-sm text-slate-400">Loading…</div>
            ) : filteredOptions.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-slate-400">No matching options.</div>
            ) : (
              filteredOptions.map((option, index) => {
                const isActive = index === activeIndex;
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={option.disabled}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectOption(option)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                      isActive ? "bg-amber-50 text-amber-700" : "text-slate-700 hover:bg-slate-50"
                    } ${option.disabled ? "opacity-50" : ""} ${isSelected ? "font-semibold" : ""}`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="truncate">{option.label}</span>
                    {option.meta && <span className="ml-3 shrink-0 text-[11px] uppercase tracking-[0.24em] text-slate-400">{option.meta}</span>}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
