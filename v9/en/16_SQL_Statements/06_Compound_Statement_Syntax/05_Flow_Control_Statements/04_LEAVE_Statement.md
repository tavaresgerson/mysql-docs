#### 15.6.5.4 LEAVE Statement

```
LEAVE label
```

This statement is used to exit the flow control construct that
has the given label. If the label is for the outermost stored
program block, [`LEAVE`](leave.html "15.6.5.4 LEAVE Statement") exits the
program.

[`LEAVE`](leave.html "15.6.5.4 LEAVE Statement") can be used within
[`BEGIN ...
END`](begin-end.html "15.6.1 BEGIN ... END Compound Statement") or loop constructs
([`LOOP`](loop.html "15.6.5.5 LOOP Statement"),
[`REPEAT`](repeat.html "15.6.5.6 REPEAT Statement"),
[`WHILE`](while.html "15.6.5.8 WHILE Statement")).

For an example, see [Section 15.6.5.5, “LOOP Statement”](loop.html "15.6.5.5 LOOP Statement").