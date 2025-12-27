### 15.1.7 ALTER LIBRARY Statement

```
ALTER LIBRARY library_name
    COMMENT "comment_text"
```

This statement adds a comment to the named JavaScript library, or replaces the existing comment if there is one. Following execution of this statement, the updated comment can be viewed in the output of `SHOW CREATE LIBRARY` and in the `ROUTINE_COMMENT` column of the Information Schema `LIBRARIES` table. The comment text must be quoted.

To remove a comment from a library without replacing it, specify an empty comment string (`COMMENT ""` or `COMMENT ''`).
