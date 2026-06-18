### 10.15.13 Exibir rastros em outras aplicações

A análise de uma traça no cliente de linha de comando **mysql** pode ser facilitada usando o comando `pager less` (ou o equivalente da sua plataforma operacional). Uma alternativa é enviar a traça para um arquivo, de forma semelhante ao que é mostrado aqui:

```
SELECT TRACE INTO DUMPFILE file
FROM INFORMATION_SCHEMA.OPTIMIZER_TRACE;
```

Você pode, então, passar esse arquivo para um editor de texto sensível ao JSON ou outro visualizador, como o complemento JsonView para Firefox e Chrome, que exibe os objetos em cores e permite que os objetos sejam expandidos ou colapsados.

`INTO DUMPFILE` é preferível a `INTO OUTFILE` para esse propósito, pois este último escapa de novas linhas. Como mencionado anteriormente, você deve garantir que `end_markers_in_json` seja `OFF` ao executar a instrução `SELECT INTO`, para que a saída seja um JSON válido.
