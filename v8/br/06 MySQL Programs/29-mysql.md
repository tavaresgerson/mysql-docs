### 6.5.1 mysql  O Cliente de Linha de Comando do MySQL

`mysql` é um shell SQL simples com capacidades de edição de linha de entrada. Ele suporta uso interativo e não interativo. Quando usado interativamente, os resultados da consulta são apresentados em um formato de tabela ASCII. Quando usado não interativamente (por exemplo, como um filtro), o resultado é apresentado em formato separado por guias. O formato de saída pode ser alterado usando opções de comando.

Se você tiver problemas devido a memória insuficiente para grandes conjuntos de resultados, use a opção `--quick`. Isso força o `mysql` a recuperar resultados do servidor uma linha de cada vez, em vez de recuperar todo o conjunto de resultados e armazená-lo na memória antes de exibi-lo. Isso é feito devolvendo o conjunto de resultados usando a função `mysql_use_result()` da API C na biblioteca cliente/servidor em vez de `mysql_store_result()`.

::: info Note

Alternativamente, o MySQL Shell oferece acesso ao X DevAPI. Para detalhes, veja MySQL Shell 8.4.

:::

Usar `mysql` é muito fácil. Invoque-o a partir do prompt do seu interpretador de comandos da seguinte forma:

```
mysql db_name
```

Ou:

```
mysql --user=user_name --password db_name
```

Neste caso, você precisará inserir sua senha em resposta ao prompt que o `mysql` exibe:

```
Enter password: your_password
```

Em seguida, digite uma instrução SQL, termine-a com `;`, `\g`, ou `\G` e pressione Enter.

Digitar **Control+C** interrompe a instrução atual se houver uma, ou cancela qualquer linha de entrada parcial.

Você pode executar instruções SQL em um arquivo de script (batch file) assim:

```
mysql db_name < script.sql > output.tab
```

No Unix, o `mysql` cliente registra instruções executadas interativamente para um arquivo de histórico.
