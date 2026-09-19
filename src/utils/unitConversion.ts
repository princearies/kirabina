// Unit conversion utilities

export type UnitSystem = 'metric' | 'imperial';
export type MetricUnit = 'mm' | 'cm' | 'm';
export type ImperialUnit = 'in' | 'ft';
export type Unit = MetricUnit | ImperialUnit;

// Conversion factors to inches (base unit)
const TO_INCHES: Record<Unit, number> = {
  'mm': 1 / 25.4,
  'cm': 1 / 2.54,
  'm': 1 / 0.0254,
  'in': 1,
  'ft': 12,
};

// Convert any unit to inches
export function toInches(value: number, fromUnit: Unit): number {
  return value * TO_INCHES[fromUnit];
}

// Convert inches to any unit
export function fromInches(inches: number, toUnit: Unit): number {
  return inches / TO_INCHES[toUnit];
}

// Convert between any two units
export function convert(value: number, fromUnit: Unit, toUnit: Unit): number {
  const inches = toInches(value, fromUnit);
  return fromInches(inches, toUnit);
}

// Format number with appropriate precision
export function formatMeasurement(value: number, unit: Unit, precision: number = 3): string {
  if (unit === 'mm') {
    return `${value.toFixed(1)} mm`;
  } else if (unit === 'cm') {
    return `${value.toFixed(2)} cm`;
  } else if (unit === 'm') {
    return `${value.toFixed(3)} m`;
  } else if (unit === 'in') {
    return `${value.toFixed(precision)}"`;
  } else if (unit === 'ft') {
    return `${value.toFixed(precision)} ft`;
  }
  return value.toString();
}

// Get unit label
export function getUnitLabel(unit: Unit): string {
  const labels: Record<Unit, string> = {
    'mm': 'Millimeters (mm)',
    'cm': 'Centimeters (cm)',
    'm': 'Meters (m)',
    'in': 'Inches (")',
    'ft': 'Feet (ft)',
  };
  return labels[unit];
}

// Get short unit symbol
export function getUnitSymbol(unit: Unit): string {
  const symbols: Record<Unit, string> = {
    'mm': 'mm',
    'cm': 'cm',
    'm': 'm',
    'in': '"',
    'ft': 'ft',
  };
  return symbols[unit];
}
