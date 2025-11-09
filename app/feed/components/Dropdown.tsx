"use client";
import React, { useState, useRef, useEffect } from "react";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  multiSelect?: boolean;
  color?: string;
}

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  multiSelect = false,
  color = "white",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionClick = (optionValue: string) => {
    if (multiSelect) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const getSelectedCount = () => {
    if (multiSelect) {
      const selectedValues = Array.isArray(value) ? value : [];
      return selectedValues.length;
    }
    return 0;
  };

  const isSelected = (optionValue: string) => {
    if (multiSelect) {
      const selectedValues = Array.isArray(value) ? value : [];
      return selectedValues.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full rounded-full border-[3px] border-emerald-900 ${color} px-6 py-3 text-left text-sm font-semibold text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_7px_0_0_rgba(16,78,61,0.5)] active:translate-y-0`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black uppercase tracking-wider">{label}</span>
            {multiSelect && getSelectedCount() > 0 && (
              <span className="rounded-full bg-emerald-900 px-2 py-0.5 text-xs font-bold text-white">
                {getSelectedCount()}
              </span>
            )}
          </div>
          <svg
            className={`h-5 w-5 text-emerald-900 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-[20px] border-[3px] border-emerald-900 bg-white shadow-[0_8px_0_0_rgba(16,78,61,0.4)]">
          <div className="max-h-64 overflow-y-auto p-2">
            {!multiSelect && (
              <button
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className={`w-full rounded-[15px] px-4 py-2 text-left text-sm font-semibold transition-colors ${
                  !value || value === ""
                    ? "bg-emerald-100 text-emerald-900"
                    : "text-emerald-900 hover:bg-emerald-50"
                }`}
              >
                {placeholder}
              </button>
            )}
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`mt-1 flex w-full items-center rounded-[15px] px-4 py-2 text-left text-sm font-semibold transition-colors ${
                  isSelected(option.value)
                    ? "bg-emerald-100 text-emerald-900"
                    : "text-emerald-900 hover:bg-emerald-50"
                }`}
              >
                {multiSelect && (
                  <div
                    className={`mr-3 flex h-5 w-5 items-center justify-center rounded border-2 border-emerald-900 ${
                      isSelected(option.value) ? "bg-emerald-900" : "bg-white"
                    }`}
                  >
                    {isSelected(option.value) && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                )}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
