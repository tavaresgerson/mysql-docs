### 23.2.3 Stored Routine Metadata

To obtain metadata about stored routines:

* Query the [`ROUTINES`](information-schema-routines-table.html "24.3.21 The INFORMATION_SCHEMA ROUTINES Table") table of the
  `INFORMATION_SCHEMA` database. See
  [Section 24.3.21, “The INFORMATION\_SCHEMA ROUTINES Table”](information-schema-routines-table.html "24.3.21 The INFORMATION_SCHEMA ROUTINES Table").

* Use the [`SHOW CREATE PROCEDURE`](show-create-procedure.html "13.7.5.9 SHOW CREATE PROCEDURE Statement")
  and [`SHOW CREATE FUNCTION`](show-create-function.html "13.7.5.8 SHOW CREATE FUNCTION Statement")
  statements to see routine definitions. See
  [Section 13.7.5.9, “SHOW CREATE PROCEDURE Statement”](show-create-procedure.html "13.7.5.9 SHOW CREATE PROCEDURE Statement").

* Use the [`SHOW PROCEDURE STATUS`](show-procedure-status.html "13.7.5.28 SHOW PROCEDURE STATUS Statement")
  and [`SHOW FUNCTION STATUS`](show-function-status.html "13.7.5.20 SHOW FUNCTION STATUS Statement")
  statements to see routine characteristics. See
  [Section 13.7.5.28, “SHOW PROCEDURE STATUS Statement”](show-procedure-status.html "13.7.5.28 SHOW PROCEDURE STATUS Statement").

* Use the [`SHOW PROCEDURE CODE`](show-procedure-code.html "13.7.5.27 SHOW PROCEDURE CODE Statement") and
  [`SHOW FUNCTION CODE`](show-function-code.html "13.7.5.19 SHOW FUNCTION CODE Statement") statements
  to see a representation of the internal implementation of the
  routine. See [Section 13.7.5.27, “SHOW PROCEDURE CODE Statement”](show-procedure-code.html "13.7.5.27 SHOW PROCEDURE CODE Statement").