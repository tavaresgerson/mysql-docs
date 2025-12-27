### 10.15.13 Displaying Traces in Other Applications

Examining a trace in the `mysql` command-line client can be made less difficult using the `pager less` command (or your operating platform's equivalent). An alternative can be to send the trace to a file, similarly to what is shown here:

```
SELECT TRACE INTO DUMPFILE file
FROM INFORMATION_SCHEMA.OPTIMIZER_TRACE;
```

You can then pass this file to a JSON-aware text editor or other viewer, such as the JsonView add-on for Firefox and Chrome, which shows objects in color and allows objects to be expanded or collapsed.

`INTO DUMPFILE` is preferable to `INTO OUTFILE` for this purpose, since the latter escapes newlines. As noted previously, you should ensure that `end_markers_in_json` is `OFF`when executing the `SELECT INTO` statement, so that the output is valid JSON.


