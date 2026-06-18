#### 15.2.13.1 Instrução SELECT ... INTO

O formulário `SELECT ... INTO` do `SELECT` permite que o resultado de uma consulta seja armazenado em variáveis ou escrito em um arquivo:

- `SELECT ... INTO var_list` seleciona os valores das colunas e os armazena em variáveis.

- `SELECT ... INTO OUTFILE` escreve as linhas selecionadas em um arquivo. Os terminadores de coluna e linha podem ser especificados para produzir um formato de saída específico.

- `SELECT ... INTO DUMPFILE` escreve uma única linha em um arquivo sem qualquer formatação.

Uma declaração `SELECT` pode conter no máximo uma cláusula `INTO`, embora, conforme demonstrado pela descrição da sintaxe `SELECT` (veja a Seção 15.2.13, “Instrução SELECT”), o `INTO` possa aparecer em diferentes posições:

- Antes de `FROM`. Exemplo:

  ```
  SELECT * INTO @myvar FROM t1;
  ```

- Antes de uma cláusula de retenção. Exemplo:

  ```
  SELECT * FROM t1 INTO @myvar FOR UPDATE;
  ```

- No final do `SELECT`. Exemplo:

  ```
  SELECT * FROM t1 FOR UPDATE INTO @myvar;
  ```

A posição `INTO` no final da declaração é suportada a partir do MySQL 8.0.20 e é a posição preferida. A posição antes de uma cláusula de bloqueio é desaconselhada a partir do MySQL 8.0.20; espera-se que o suporte a ela seja removido em uma versão futura do MySQL. Em outras palavras, `INTO` após `FROM`, mas não no final de `SELECT`, produz um aviso.

Uma cláusula `INTO` não deve ser usada em uma cláusula `SELECT` aninhada, porque tal `SELECT` deve retornar seu resultado ao contexto externo. Há também restrições sobre o uso de `INTO` dentro das instruções `UNION`; veja a Seção 15.2.18, “Cláusula UNION”.

Para a variante `INTO var_list`:

- `var_list` nomeia uma lista de uma ou mais variáveis, que podem ser variáveis definidas pelo usuário, parâmetros de procedimento armazenado ou função armazenada, ou variáveis locais de programa armazenado. (Dentro de uma instrução preparada `SELECT ... INTO var_list`, apenas variáveis definidas pelo usuário são permitidas; veja a Seção 15.6.4.2, “Âmbito e Resolução de Variáveis Locais”.)

- Os valores selecionados são atribuídos às variáveis. O número de variáveis deve corresponder ao número de colunas. A consulta deve retornar uma única linha. Se a consulta não retornar nenhuma linha, um aviso com o código de erro 1329 ocorre (`No data`), e os valores das variáveis permanecem inalterados. Se a consulta retornar várias linhas, o erro 1172 ocorre (`Result consisted of more than one row`). Se for possível que a instrução possa recuperar várias linhas, você pode usar `LIMIT 1` para limitar o conjunto de resultados a uma única linha.

  ```
  SELECT id, data INTO @x, @y FROM test.t1 LIMIT 1;
  ```

`INTO var_list` também pode ser usado com uma declaração `TABLE`, sujeito a essas restrições:

- O número de variáveis deve corresponder ao número de colunas da tabela.

- Se a tabela contiver mais de uma linha, você deve usar `LIMIT 1` para limitar o conjunto de resultados a uma única linha. `LIMIT 1` deve preceder a palavra-chave `INTO`.

Um exemplo de tal declaração é mostrado aqui:

```
TABLE employees ORDER BY lname DESC LIMIT 1
    INTO @id, @fname, @lname, @hired, @separated, @job_code, @store_id;
```

Você também pode selecionar valores de uma declaração `VALUES` que gera uma única linha em um conjunto de variáveis de usuário. Nesse caso, você deve usar um alias de tabela e atribuir cada valor da lista de valores a uma variável. Cada uma das duas declarações mostradas aqui é equivalente a `SET @x=2, @y=4, @z=8`:

```
SELECT * FROM (VALUES ROW(2,4,8)) AS t INTO @x,@y,@z;

SELECT * FROM (VALUES ROW(2,4,8)) AS t(a,b,c) INTO @x,@y,@z;
```

Os nomes de variáveis do usuário não são sensíveis ao maiúsculas e minúsculas. Consulte a Seção 11.4, “Variáveis Definidas pelo Usuário”.

O formulário `SELECT ... INTO OUTFILE 'file_name'` de `SELECT` escreve as linhas selecionadas em um arquivo. O arquivo é criado no host do servidor, portanto, você deve ter o privilégio `FILE` para usar essa sintaxe. `file_name` não pode ser um arquivo existente, o que, entre outras coisas, impede que arquivos como `/etc/passwd` e tabelas de banco de dados sejam modificados. A variável de sistema `character_set_filesystem` controla a interpretação do nome do arquivo.

A declaração `SELECT ... INTO OUTFILE` é destinada a permitir o descarregamento de uma tabela para um arquivo de texto no host do servidor. Para criar o arquivo resultante em outro host, `SELECT ... INTO OUTFILE` normalmente não é adequado, pois não há como escrever um caminho para o arquivo em relação ao sistema de arquivos do host do servidor, a menos que a localização do arquivo no host remoto possa ser acessada usando um caminho mapeado pela rede no sistema de arquivos do host do servidor.

Alternativamente, se o software cliente MySQL estiver instalado no host remoto, você pode usar um comando do cliente, como `mysql -e "SELECT ..." > file_name`, para gerar o arquivo nesse host.

`SELECT ... INTO OUTFILE` é o complemento de `LOAD DATA`. Os valores das colunas são escritos convertidos para o conjunto de caracteres especificado na cláusula `CHARACTER SET`. Se tal cláusula não estiver presente, os valores são descarregados usando o conjunto de caracteres `binary`. Na prática, não há conversão de conjunto de caracteres. Se um conjunto de resultados contiver colunas em vários conjuntos de caracteres, o mesmo acontece com o arquivo de dados de saída, e pode não ser possível recarregar o arquivo corretamente.

A sintaxe da parte `export_options` da declaração consiste nas mesmas cláusulas `FIELDS` e `LINES` que são usadas com a declaração `LOAD DATA`. Para obter informações mais detalhadas sobre as cláusulas `FIELDS` e `LINES`, incluindo seus valores padrão e valores permitidos, consulte a Seção 15.2.9, “Declaração LOAD DATA”.

`FIELDS ESCAPED BY` controla como escrever caracteres especiais. Se o caractere `FIELDS ESCAPED BY` não estiver vazio, ele é usado quando necessário para evitar ambiguidade como um prefixo que precede os caracteres seguintes na saída:

- O caractere `FIELDS ESCAPED BY`

- O caractere `FIELDS [OPTIONALLY] ENCLOSED BY`

- O primeiro caractere dos valores `FIELDS TERMINATED BY` e `LINES TERMINATED BY`

- ASCII `NUL` (o byte com valor zero; o que é realmente escrito após o caractere de escape é ASCII `0`, e não um byte com valor zero)

Os caracteres `FIELDS TERMINATED BY`, `ENCLOSED BY`, `ESCAPED BY` ou `LINES TERMINATED BY` *devem* ser escapados para que você possa ler o arquivo de volta de forma confiável. O ASCII `NUL` é escapado para facilitar a visualização com alguns pagers.

O arquivo resultante não precisa seguir a sintaxe do SQL, então nada mais precisa ser escamado.

Se o caractere `FIELDS ESCAPED BY` estiver vazio, nenhum caractere é escamado e `NULL` é exibido como `NULL`, e não `\N`. Provavelmente não é uma boa ideia especificar um caractere de escape vazio, especialmente se os valores de campo em seus dados contiverem algum dos caracteres da lista que acabamos de fornecer.

`INTO OUTFILE` também pode ser usado com uma declaração `TABLE` quando você deseja descartar todas as colunas de uma tabela em um arquivo de texto. Neste caso, a ordem e o número de linhas podem ser controlados usando `ORDER BY` e `LIMIT`; essas cláusulas devem preceder `INTO OUTFILE`. `TABLE ... INTO OUTFILE` suporta o mesmo `export_options` que `SELECT ... INTO OUTFILE`, e está sujeito às mesmas restrições de escrita no sistema de arquivos. Um exemplo de tal declaração é mostrado aqui:

```
TABLE employees ORDER BY lname LIMIT 1000
    INTO OUTFILE '/tmp/employee_data_1.txt'
    FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"', ESCAPED BY '\'
    LINES TERMINATED BY '\n';
```

Você também pode usar `SELECT ... INTO OUTFILE` com uma declaração `VALUES` para escrever valores diretamente em um arquivo. Um exemplo é mostrado aqui:

```
SELECT * FROM (VALUES ROW(1,2,3),ROW(4,5,6),ROW(7,8,9)) AS t
    INTO OUTFILE '/tmp/select-values.txt';
```

Você deve usar um alias de tabela; aliases de coluna também são suportados e podem ser usados opcionalmente para escrever valores apenas das colunas desejadas. Você também pode usar qualquer uma ou todas as opções de exportação suportadas pelo `SELECT ... INTO OUTFILE` para formatar a saída para o arquivo.

Aqui está um exemplo que produz um arquivo no formato de valores separados por vírgula (CSV), usado por muitos programas:

```
SELECT a,b,a+b INTO OUTFILE '/tmp/result.txt'
  FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  FROM test_table;
```

Se você usar `INTO DUMPFILE` em vez de `INTO OUTFILE`, o MySQL escreve apenas uma linha no arquivo, sem nenhuma terminação de coluna ou linha e sem realizar nenhum processamento de escape. Isso é útil para selecionar um valor `BLOB` e armazená-lo em um arquivo.

`TABLE` também suporta `INTO DUMPFILE`. Se a tabela contiver mais de uma linha, você também deve usar `LIMIT 1` para limitar a saída a uma única linha. `INTO DUMPFILE` também pode ser usado com `SELECT * FROM (VALUES ROW()[, ...]) AS table_alias [LIMIT 1]`. Veja a Seção 15.2.19, “Instrução VALUES”.

Nota

Qualquer arquivo criado por `INTO OUTFILE` ou `INTO DUMPFILE` pertence ao usuário do sistema operacional sob cuja conta o **mysqld** está rodando. (Você *nunca* deve rodar o **mysqld** como `root` por este e outros motivos.) A partir do MySQL 8.0.17, o umask para criação de arquivos é 0640; você deve ter privilégios de acesso suficientes para manipular o conteúdo do arquivo. Antes do MySQL 8.0.17, o umask era 0666 e o arquivo era legível por todos os usuários no host do servidor.

Se a variável de sistema `secure_file_priv` estiver definida como um nome de diretório não vazio, o arquivo a ser escrito deve estar localizado nesse diretório.

No contexto das declarações `SELECT ... INTO` que ocorrem como parte de eventos executados pelo Agendamento de Eventos, mensagens de diagnóstico (não apenas erros, mas também avisos) são escritas no log de erros e, no Windows, no log de eventos do aplicativo. Para obter informações adicionais, consulte a Seção 27.4.5, “Status do Agendamento de Eventos”.

A partir do MySQL 8.0.22, o suporte é fornecido para a sincronização periódica de arquivos de saída escritos por `SELECT INTO OUTFILE` e `SELECT INTO DUMPFILE`, habilitado ao definir a variável de sistema do servidor `select_into_disk_sync`, introduzida nessa versão. O tamanho do buffer de saída e o atraso opcional podem ser definidos, respectivamente, por `select_into_buffer_size` e `select_into_disk_sync_delay`. Para mais informações, consulte as descrições dessas variáveis de sistema.
