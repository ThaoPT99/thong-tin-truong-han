# -*- coding: utf-8 -*-
import openpyxl
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

path = r'c:\Users\phant\Downloads\Thông tin trường Hàn kỳ tháng 9_2026 (1).xlsx'
wb = openpyxl.load_workbook(path, data_only=True)

output = []
output.append("SHEETS: " + str(wb.sheetnames))

for name in wb.sheetnames:
    ws = wb[name]
    output.append(f"\n=== {name} (rows: {ws.max_row}, cols: {ws.max_column}) ===")
    for r in range(1, min(50, ws.max_row + 1)):
        row_vals = []
        for c in range(1, min(9, ws.max_column + 2)):
            val = ws.cell(r, c).value
            if val is not None:
                row_vals.append(str(val)[:80])
            else:
                row_vals.append("")
        output.append(f"R{r}: " + " | ".join(row_vals))

with open("excel_output.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(output))
print("Done. Check excel_output.txt")
