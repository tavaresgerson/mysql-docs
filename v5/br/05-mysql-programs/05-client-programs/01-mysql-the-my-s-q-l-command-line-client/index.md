### 4.5.1 mysql — O cliente de linha de comando do MySQL

4.5.1.1 Opções do cliente do MySQL

4.5.1.2 Comandos do cliente do MySQL

4.5.1.3 Registro do cliente do MySQL

4.5.1.4 Ajuda do cliente do MySQL no lado do servidor

4.5.1.5 Executando instruções SQL a partir de um arquivo de texto

4.5.1.6 Dicas do cliente do MySQL

**mysql** é um shell SQL simples com recursos de edição de linha de entrada. Ele suporta uso interativo e não interativo. Quando usado de forma interativa, os resultados das consultas são apresentados em um formato de tabela ASCII. Quando usado de forma não interativa (por exemplo, como um filtro), o resultado é apresentado em formato de tabulação. O formato de saída pode ser alterado usando opções de comando.

Se você tiver problemas devido à memória insuficiente para conjuntos de resultados grandes, use a opção `--quick`. Isso obriga o **mysql** a recuperar os resultados do servidor linha por linha, em vez de recuperar todo o conjunto de resultados e armazená-lo na memória antes de exibí-lo. Isso é feito retornando o conjunto de resultados usando a função C `mysql_use_result()` na biblioteca cliente/servidor, em vez de `mysql_store_result()`.

Nota

Como alternativa, o MySQL Shell oferece acesso à X DevAPI. Para obter detalhes, consulte o MySQL Shell 8.0.

Usar o **mysql** é muito fácil. Invoque-o a partir do prompt do seu interpretador de comandos da seguinte forma:

```sql
mysql db_name
```

Ou:

```sql
mysql --user=user_name --password db_name
```

Nesse caso, você precisará digitar sua senha em resposta ao prompt que o **mysql** exibe:

```sql
Enter password: your_password
```

Em seguida, digite uma instrução SQL, termine-a com `;`, `\g` ou `\G` e pressione Enter.

A digitação de **Control+C** interrompe a declaração atual, se houver uma, ou cancela qualquer linha de entrada parcial, caso contrário.

Você pode executar instruções SQL em um arquivo de script (arquivo de lote) da seguinte maneira:

```sql
mysql db_name < script.sql > output.tab
```

No Unix, o cliente **mysql** registra as instruções executadas interativamente em um arquivo de histórico. Veja a Seção 4.5.1.3, “Registro do Cliente mysql”.
