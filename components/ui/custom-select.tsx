"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  id?: string;
  required?: boolean;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
  id,
  required = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Hidden input for form validation */}
      <input
        type="hidden"
        id={id}
        value={value}
        required={required}
      />
      
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 pr-10 border-2 border-zinc-200 rounded-2xl bg-white text-black text-left font-medium focus:outline-none focus:border-lime-400 transition-colors"
      >
        {selectedOption ? selectedOption.label : placeholder}
      </button>

      {/* Dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <svg
          className={`w-5 h-5 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 border-2 border-zinc-200 rounded-2xl bg-white shadow-lg overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-3 text-left font-medium transition-colors ${
                option.value === value
                  ? "bg-lime-200 text-lime-800"
                  : "bg-white text-black hover:bg-zinc-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
