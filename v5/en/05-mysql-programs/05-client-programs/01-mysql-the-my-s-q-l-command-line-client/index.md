### 4.5.1 mysql — O Cliente de Linha de Comando do MySQL

4.5.1.1 Opções do Cliente mysql

4.5.1.2 Comandos do Cliente mysql

4.5.1.3 Registro (Logging) do Cliente mysql

4.5.1.4 Ajuda do Lado do Servidor (Server-Side Help) do Cliente mysql

4.5.1.5 Executando Instruções SQL a partir de um Arquivo de Texto

4.5.1.6 Dicas do Cliente mysql

**mysql** é um simples SQL shell com capacidades de edição de linha de entrada. Ele suporta uso interativo e não interativo. Quando usado interativamente, os resultados da Query são apresentados em formato de tabela ASCII. Quando usado de forma não interativa (por exemplo, como um filtro), o resultado é apresentado em formato separado por tabulação (tab-separated format). O formato de saída pode ser alterado usando opções de comando.

Se você tiver problemas devido à memória insuficiente para grandes conjuntos de resultados (result sets), utilize a opção `--quick`. Isso força o **mysql** a recuperar os resultados do server linha por linha, em vez de recuperar o conjunto de resultados inteiro e armazená-lo em um Buffer na memória antes de exibi-lo. Isso é feito retornando o result set utilizando a função `mysql_use_result()` da C API na biblioteca client/server, em vez de `mysql_store_result()`.

Nota

Alternativamente, o MySQL Shell oferece acesso ao X DevAPI. Para detalhes, consulte MySQL Shell 8.0.

Usar o **mysql** é muito fácil. Invoque-o a partir do prompt do seu interpretador de comandos da seguinte forma:

```sql
mysql db_name
```

Ou:

```sql
mysql --user=user_name --password db_name
```

Neste caso, você precisará digitar sua senha em resposta ao prompt que o **mysql** exibe:

```sql
Enter password: your_password
```

Em seguida, digite uma instrução SQL, finalize-a com `;`, `\g` ou `\G` e pressione Enter.

Digitar **Control+C** interrompe a instrução atual, se houver, ou cancela qualquer linha de entrada parcial, caso contrário.

Você pode executar instruções SQL em um arquivo de script (arquivo batch) assim:

```sql
mysql db_name < script.sql > output.tab
```

Em sistemas Unix, o cliente **mysql** registra (logs) as instruções executadas interativamente em um arquivo de histórico. Consulte Seção 4.5.1.3, “Registro (Logging) do Cliente mysql”.