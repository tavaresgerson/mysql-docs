#### 15.2.13.1 Instrução `SELECT ... INTO`

A forma `SELECT ... INTO` do comando `SELECT` permite que o resultado de uma consulta seja armazenado em variáveis ou escrito em um arquivo:

* `SELECT ... INTO var_list` seleciona os valores das colunas e os armazena em variáveis.

* `SELECT ... INTO OUTFILE` escreve as linhas selecionadas em um arquivo. Os delimitadores de coluna e linha podem ser especificados para produzir um formato de saída específico.

* `SELECT ... INTO DUMPFILE` escreve uma única linha em um arquivo sem qualquer formatação.

Uma instrução `SELECT` dada pode conter no máximo uma cláusula `INTO`, embora, conforme mostrado na descrição da sintaxe do `SELECT` (veja a Seção 15.2.13, “Instrução SELECT”), o `INTO` possa aparecer em diferentes posições:

* Antes de `FROM`. Exemplo:

  ```
  SELECT * INTO @myvar FROM t1;
  ```

* Antes de uma cláusula de bloqueio final. Exemplo:

  ```
  SELECT * FROM t1 INTO @myvar FOR UPDATE;
  ```

* No final da instrução `SELECT`. Exemplo:

  ```
  SELECT * FROM t1 FOR UPDATE INTO @myvar;
  ```

A posição do `INTO` no final da instrução é a posição preferida. A posição antes de uma cláusula de bloqueio é desaconselhada; espere o suporte para ela ser removido em uma versão futura do MySQL. Em outras palavras, `INTO` após `FROM`, mas não no final do `SELECT`, produz um aviso.

Uma cláusula `INTO` não deve ser usada em uma `SELECT` aninhada, porque tal `SELECT` deve retornar seu resultado para o contexto externo. Há também restrições sobre o uso de `INTO` dentro de instruções `UNION`; veja a Seção 15.2.18, “Cláusula UNION”.

Para a variante `INTO var_list`:

* *`var_list`* nomeia uma lista de uma ou mais variáveis, cada uma das quais pode ser uma variável definida pelo usuário, parâmetro de procedimento armazenado ou função, ou variável local de programa armazenado. (Dentro de uma instrução `SELECT ... INTO var_list` preparada, apenas variáveis definidas pelo usuário são permitidas; veja a Seção 15.6.4.2, “Âmbito e Resolução de Variáveis Locais”.)

* Os valores selecionados são atribuídos às variáveis. O número de variáveis deve corresponder ao número de colunas. A consulta deve retornar uma única linha. Se a consulta retornar nenhuma linha, ocorre um aviso com o código de erro 1329 (`Sem dados`) e os valores das variáveis permanecem inalterados. Se a consulta retornar várias linhas, ocorre o erro 1172 (`Resultado consistiu em mais de uma linha`). Se for possível que a instrução possa recuperar várias linhas, você pode usar `LIMIT 1` para limitar o conjunto de resultados a uma única linha.

```
  SELECT id, data INTO @x, @y FROM test.t1 LIMIT 1;
  ```

`INTO var_list` também pode ser usado com uma instrução `TABLE`, sujeito a essas restrições:

* O número de variáveis deve corresponder ao número de colunas na tabela.

* Se a tabela contiver mais de uma linha, você deve usar `LIMIT 1` para limitar o conjunto de resultados a uma única linha. `LIMIT 1` deve preceder a palavra-chave `INTO`.

Um exemplo de tal instrução é mostrado aqui:

```
TABLE employees ORDER BY lname DESC LIMIT 1
    INTO @id, @fname, @lname, @hired, @separated, @job_code, @store_id;
```

Você também pode selecionar valores de uma instrução `VALUES` que gera uma única linha em um conjunto de variáveis do usuário. Neste caso, você deve empregar um alias de tabela e deve atribuir cada valor da lista de valores a uma variável. Cada uma das duas instruções mostradas aqui é equivalente a `SET @x=2, @y=4, @z=8`:

```
SELECT * FROM (VALUES ROW(2,4,8)) AS t INTO @x,@y,@z;

SELECT * FROM (VALUES ROW(2,4,8)) AS t(a,b,c) INTO @x,@y,@z;
```

Os nomes das variáveis do usuário não são case-sensitive. Veja a Seção 11.4, “Variáveis Definidas pelo Usuário”.

A forma `SELECT ... INTO OUTFILE 'file_name'` da instrução `SELECT` escreve as linhas selecionadas em um arquivo. O arquivo é criado no host do servidor, então você deve ter o privilégio `FILE` para usar essa sintaxe. *`file_name`* não pode ser um arquivo existente, o que, entre outras coisas, impede que arquivos como `/etc/passwd` e tabelas de banco de dados sejam modificados. A variável de sistema `character_set_filesystem` controla a interpretação do nome do arquivo.

A instrução `SELECT ... INTO OUTFILE` destina-se a permitir o descarte de uma tabela em um arquivo de texto no host do servidor. Para criar o arquivo resultante em outro host, a instrução `SELECT ... INTO OUTFILE` normalmente não é adequada, pois não há como escrever um caminho para o arquivo em relação ao sistema de arquivos do host do servidor, a menos que a localização do arquivo no host remoto possa ser acessada usando um caminho mapeado na rede no sistema de arquivos do host do servidor.

Alternativamente, se o software cliente MySQL estiver instalado no host remoto, você pode usar um comando do cliente, como `mysql -e "SELECT ..." > nome_do_arquivo`, para gerar o arquivo nesse host.

`SELECT ... INTO OUTFILE` é o complemento de `LOAD DATA`. Os valores das colunas são escritos convertidos para o conjunto de caracteres especificado na cláusula `CHARACTER SET`. Se tal cláusula não estiver presente, os valores são descartados usando o conjunto de caracteres `binary`. Na verdade, não há conversão de conjunto de caracteres. Se um conjunto de resultados contiver colunas em vários conjuntos de caracteres, o arquivo de dados de saída também o fará, e pode não ser possível recarregar o arquivo corretamente.

A sintaxe da parte *`export_options`* da instrução consiste nas mesmas cláusulas `FIELDS` e `LINES` que são usadas com a instrução `LOAD DATA`. Para informações mais detalhadas sobre as cláusulas `FIELDS` e `LINES`, incluindo seus valores padrão e permitidos, consulte a Seção 15.2.9, “Instrução LOAD DATA”.

`FIELDS ESCAPED BY` controla como escrever caracteres especiais. Se o caractere `FIELDS ESCAPED BY` não estiver vazio, ele é usado quando necessário para evitar ambiguidade como um prefixo que precede os caracteres seguintes na saída:

* O caractere `FIELDS ESCAPED BY`
* O caractere `FIELDS [OPTIONALLY] ENCLOSED BY`

* O primeiro caractere dos valores `FIELDS TERMINATED BY` e `LINES TERMINATED BY`

* Os caracteres `FIELDS TERMINATED BY`, `ENCLOSED BY`, `ESCAPED BY` ou `LINES TERMINATED BY` *devem* ser escapados para que você possa ler o arquivo de volta de forma confiável. O ASCII `NUL` é escapado para facilitar a visualização com alguns pagers.

O arquivo resultante não precisa seguir a sintaxe SQL, então nada mais precisa ser escapado.

Se o caractere `FIELDS ESCAPED BY` estiver vazio, nenhum caractere é escapado e `NULL` é exibido como `NULL`, não como `\N`. Provavelmente não é uma boa ideia especificar um caractere de escape vazio, especialmente se os valores dos campos em seus dados contiverem algum dos caracteres da lista fornecida.

`INTO OUTFILE` também pode ser usado com uma declaração `TABLE` quando você deseja descartar todas as colunas de uma tabela em um arquivo de texto. Neste caso, a ordem e o número de linhas podem ser controlados usando `ORDER BY` e `LIMIT`; essas cláusulas devem preceder `INTO OUTFILE`. `TABLE ... INTO OUTFILE` suporta as mesmas *`export_options`* que `SELECT ... INTO OUTFILE`, e está sujeito às mesmas restrições de escrita no sistema de arquivos. Um exemplo de tal declaração é mostrado aqui:

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

Você deve usar um alias de tabela; aliases de coluna também são suportados e podem ser usados opcionalmente para escrever valores apenas das colunas desejadas. Você também pode usar qualquer ou todas as opções de exportação suportadas por `SELECT ... INTO OUTFILE` para formatar a saída para o arquivo.

Aqui está um exemplo que produz um arquivo no formato de valores separados por vírgula (CSV) usado por muitos programas:

```
SELECT a,b,a+b INTO OUTFILE '/tmp/result.txt'
  FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  FROM test_table;
```

Se você usar `INTO DUMPFILE` em vez de `INTO OUTFILE`, o MySQL escreve apenas uma linha no arquivo, sem nenhuma terminação de coluna ou linha e sem realizar nenhum processamento de escape. Isso é útil para selecionar um valor `BLOB` e armazená-lo em um arquivo.

O `TABLE` também suporta `INTO DUMPFILE`. Se a tabela contiver mais de uma linha, você também deve usar `LIMIT 1` para limitar a saída a uma única linha. `INTO DUMPFILE` também pode ser usado com `SELECT * FROM (VALUES ROW()[, ...]) AS table_alias [LIMIT 1]`. Veja a Seção 15.2.19, “Instrução VALUES”.

Observação

Qualquer arquivo criado por `INTO OUTFILE` ou `INTO DUMPFILE` é de propriedade do usuário do sistema operacional sob cuja conta o **mysqld** está rodando. (Você *nunca* deve rodar **mysqld** como `root` por essa e outras razões.) A máscara de permissão de arquivo é 0640; você deve ter privilégios de acesso suficientes para manipular o conteúdo do arquivo.

Se a variável de sistema `secure_file_priv` estiver definida como um nome de diretório não vazio, o arquivo a ser escrito deve estar localizado nesse diretório.

No contexto das instruções `SELECT ... INTO` que ocorrem como parte de eventos executados pelo Agendamento de Eventos, mensagens de diagnóstico (não apenas erros, mas também avisos) são escritas no log de erro e, no Windows, no log de eventos do aplicativo. Para obter informações adicionais, consulte a Seção 27.5.5, “Status do Agendamento de Eventos”.

É fornecido suporte para a sincronização periódica de arquivos de saída escritos por `SELECT INTO OUTFILE` e `SELECT INTO DUMPFILE`, habilitada definindo a variável de sistema do servidor `select_into_disk_sync`, introduzida nessa versão. O tamanho do buffer de saída e o atraso opcional podem ser definidos usando, respectivamente, `select_into_buffer_size` e `select_into_disk_sync_delay`. Para obter mais informações, consulte as descrições dessas variáveis de sistema.