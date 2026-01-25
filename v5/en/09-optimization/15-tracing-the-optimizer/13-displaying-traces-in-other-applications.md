### 8.15.13 Exibindo Traces em Outras Aplicações

Examinar um *trace* no *command-line client* **mysql** pode ser facilitado usando o comando `pager less` (ou o equivalente da sua plataforma operacional). Uma alternativa é enviar o *trace* para um arquivo, de forma semelhante ao que é mostrado aqui:

```sql
SELECT TRACE INTO DUMPFILE file
FROM INFORMATION_SCHEMA.OPTIMIZER_TRACE;
```

Você pode então passar este arquivo para um editor de texto com suporte a JSON ou outro visualizador, como o [JsonView add-on para Firefox e Chrome](https://jsonview.com/), que exibe objetos em cores e permite que os objetos sejam expandidos ou recolhidos.

`INTO DUMPFILE` é preferível a `INTO OUTFILE` para este propósito, visto que este último realiza *escapes* de *newlines* (quebras de linha). Conforme observado anteriormente, você deve garantir que `end_markers_in_json` esteja como `OFF` ao executar a instrução `SELECT INTO`, para que a saída seja um JSON válido.