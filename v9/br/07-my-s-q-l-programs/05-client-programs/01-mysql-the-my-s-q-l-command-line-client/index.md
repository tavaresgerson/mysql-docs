### 6.5.1 mysql — O Cliente de Linha de Comando do MySQL

6.5.1.1 Opções do Cliente de Linha de Comando do mysql

6.5.1.2 Comandos do Cliente de Linha de Comando do mysql

6.5.1.3 Registro do Cliente de Linha de Comando do mysql

6.5.1.4 Ajuda no Lado do Servidor do Cliente de Linha de Comando do mysql

6.5.1.5 Executando Instruções SQL a partir de um Arquivo de Texto

6.5.1.6 Dicas do Cliente de Linha de Comando do mysql

O **mysql** é um shell SQL simples com capacidades de edição de linha de entrada. Ele suporta uso interativo e não interativo. Quando usado de forma interativa, os resultados das consultas são apresentados em um formato de tabela ASCII. Quando usado de forma não interativa (por exemplo, como um filtro), o resultado é apresentado em formato de tabulação. O formato de saída pode ser alterado usando opções de comando.

Se você tiver problemas devido à memória insuficiente para conjuntos de resultados grandes, use a opção `--quick`. Isso força o **mysql** a recuperar os resultados do servidor uma linha de cada vez, em vez de recuperar todo o conjunto de resultados e armazená-lo na memória antes de exibí-lo. Isso é feito retornando o conjunto de resultados usando a função C `mysql_use_result()` na biblioteca cliente/servidor, em vez de `mysql_store_result()`.

Nota

Alternativamente, o MySQL Shell oferece acesso à X DevAPI. Para detalhes, consulte MySQL Shell 9.5.

Usar o **mysql** é muito fácil. Inicie-o a partir do prompt do seu interpretador de comandos da seguinte forma:

```
mysql db_name
```

Ou:

```
mysql --user=user_name --password db_name
```

Neste caso, você precisará inserir sua senha em resposta ao prompt que o **mysql** exibe:

```
Enter password: your_password
```

Em seguida, digite uma instrução SQL, termine-a com `;`, `\g` ou `\G` e pressione Enter.

A digitação de `Control+C` interrompe a instrução atual, se houver, ou cancela qualquer linha de entrada parcial, caso contrário.

Você pode executar instruções SQL em um arquivo de script (arquivo de lote) da seguinte forma:

```
mysql db_name < script.sql > output.tab
```

No Unix, o cliente **mysql** registra as instruções executadas interativamente em um arquivo de histórico. Veja a Seção 6.5.1.3, “Registro do cliente mysql”.