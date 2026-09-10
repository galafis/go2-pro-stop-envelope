"""Compare the compiled C++ implementation with all public JS examples / Comparar."""
import csv
import io
import json
import math
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FIELDS = ("speedMps", "reactionMs", "reactionUncertaintyMs", "decelerationMps2",
          "decelerationUncertaintyPct", "marginM", "availableM")


def main():
    executable = str(Path(sys.argv[1]).resolve())
    count = 0
    for item in json.loads((ROOT / "examples/index.json").read_text(encoding="utf-8")):
        source = ROOT / "examples" / item["file"]
        scenario = json.loads(source.read_text(encoding="utf-8"))
        script = "import {run} from './src/engine.js'; import {readFileSync} from 'node:fs'; process.stdout.write(JSON.stringify(run(JSON.parse(readFileSync(process.argv[1], 'utf8')))));"
        expected = json.loads(subprocess.check_output(["node", "--input-type=module", "-e", script, str(source)], cwd=ROOT))
        result = subprocess.run([executable, *[str(scenario[field]) for field in FIELDS]], capture_output=True, text=True)
        assert result.returncode == (2 if expected["status"] == "review-required" else 0), result.stderr
        actual = json.loads(result.stdout)
        for metric in expected["metrics"]:
            assert math.isclose(actual[metric["key"]], metric["value"], abs_tol=1.1e-6, rel_tol=1e-10), metric
        for key, value in expected["components"].items():
            assert math.isclose(actual["components"][key], value, abs_tol=1.1e-6, rel_tol=1e-10)
        curve = subprocess.check_output([executable, "--curve", *[str(scenario[field]) for field in FIELDS]], text=True)
        rows = list(csv.DictReader(io.StringIO(curve)))
        assert len(rows) == len(expected["records"])
        for row, expected_row in zip(rows, expected["records"]):
            for key, value in expected_row.items():
                assert math.isclose(float(row[key]), value, abs_tol=1.1e-6, rel_tol=1e-10)
        count += 1
    for invalid in ("nan", "inf", "1junk", "0x1", "-1", "11", "1e9999"):
        result = subprocess.run([executable, invalid, "200", "100", "2", "20", ".3", "2"], capture_output=True)
        assert result.returncode == 1 and result.stdout == b""
    print(f"{count} C++/JavaScript scenarios, curves and malformed arguments verified / verificados")


if __name__ == "__main__":
    main()
