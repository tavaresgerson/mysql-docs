## 14.20 Window Functions

[14.20.1 Window Function Descriptions](window-function-descriptions.html)

[14.20.2 Window Function Concepts and Syntax](window-functions-usage.html)

[14.20.3 Window Function Frame Specification](window-functions-frames.html)

[14.20.4 Named Windows](window-functions-named-windows.html)

[14.20.5 Window Function Restrictions](window-function-restrictions.html)

MySQL supports window functions that, for each row from a query,
perform a calculation using rows related to that row. The
following sections discuss how to use window functions, including
descriptions of the `OVER` and
`WINDOW` clauses. The first section provides
descriptions of the nonaggregate window functions. For
descriptions of the aggregate window functions, see
[Section 14.19.1, “Aggregate Function Descriptions”](aggregate-functions.html "14.19.1 Aggregate Function Descriptions").

For information about optimization and window functions, see
[Section 10.2.1.21, “Window Function Optimization”](window-function-optimization.html "10.2.1.21 Window Function Optimization").