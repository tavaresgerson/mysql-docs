#### 15.6.5.4 LEAVE Statement

```
LEAVE label
```

This statement is used to exit the flow control construct that has the given label. If the label is for the outermost stored program block, `LEAVE` exits the program.

`LEAVE` can be used within [`BEGIN ... END`](begin-end.html "15.6.1 BEGIN ... END Compound Statement") or loop constructs (`LOOP`, `REPEAT`, `WHILE`).

For an example, see Section 15.6.5.5, “LOOP Statement”.