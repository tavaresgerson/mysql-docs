#### 15.6.6.1 Cursor CLOSE Statement

```
CLOSE cursor_name
```

This statement closes a previously opened cursor. For an
example, see [Section 15.6.6, “Cursors”](cursors.html "15.6.6 Cursors").

An error occurs if the cursor is not open.

If not closed explicitly, a cursor is closed at the end of the
[`BEGIN ...
END`](begin-end.html "15.6.1 BEGIN ... END Compound Statement") block in which it was declared.