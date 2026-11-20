"""
Utility helpers for calculation and conversions.
"""
from typing import Any, Union

def safe_float(val: Any, default: float = 0.0) -> float:
    if val is None or val == "" or str(val).strip().upper() == "NA":
        return default
    try:
        return float(val)
    except (ValueError, TypeError):
        return default

def safe_int(val: Any, default: int = 0) -> int:
    if val is None or val == "" or str(val).strip().upper() == "NA":
        return default
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return default

def calc_rate(numerator: Union[int, float], denominator: Union[int, float], multiplier: float = 100.0) -> float:
    """
    Safely calculates rate = (num / den) * multiplier.
    Returns 0.0 if denominator is 0.
    """
    num = safe_float(numerator)
    den = safe_float(denominator)
    if den <= 0:
        return 0.0
    return round((num / den) * multiplier, 2)

def calc_percentage_change(old_val: Union[int, float], new_val: Union[int, float]) -> float:
    """
    Calculates percentage change = ((new - old) / old) * 100.
    """
    old = safe_float(old_val)
    new = safe_float(new_val)
    if old <= 0:
        return 0.0
    return round(((new - old) / old) * 100.0, 2)
