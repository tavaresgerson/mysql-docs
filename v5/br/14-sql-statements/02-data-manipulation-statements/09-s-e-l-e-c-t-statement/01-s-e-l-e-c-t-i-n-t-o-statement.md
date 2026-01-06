#### 13.2.9.1 Instrução SELECT ... INTO

O formulário `SELECT ... INTO` do comando `SELECT` permite que o resultado de uma consulta seja armazenado em variáveis ou escrito em um arquivo:

- `SELECT ... INTO var_list` seleciona os valores das colunas e os armazena em variáveis.

- `SELECT ... INTO OUTFILE` escreve as linhas selecionadas em um arquivo. Os terminadores de coluna e linha podem ser especificados para produzir um formato de saída específico.

- `SELECT ... INTO DUMPFILE` escreve uma única linha em um arquivo sem qualquer formatação.

Uma instrução `[SELECT]` (select.html) pode conter no máximo uma cláusula `INTO`, embora, conforme demonstrado na descrição da sintaxe da instrução `[SELECT]` (ver Seção 13.2.9, “Instrução SELECT”), a cláusula `INTO` possa aparecer em diferentes posições:

- Antes de `FROM`. Exemplo:

  ```sql
  SELECT * INTO @myvar FROM t1;
  ```

- Antes de uma cláusula de retenção. Exemplo:

  ```sql
  SELECT * FROM t1 INTO @myvar FOR UPDATE;
  ```

Uma cláusula `INTO` não deve ser usada em uma cláusula `SELECT` aninhada porque essa `SELECT` deve retornar seu resultado ao contexto externo. Há também restrições sobre o uso de `INTO` dentro das instruções `UNION`; veja Seção 13.2.9.3, “Cláusula UNION”.

Para a variante `INTO var_list`:

- *`var_list`* nomeia uma lista de uma ou mais variáveis, cada uma das quais pode ser uma variável definida pelo usuário, parâmetro de procedimento ou função armazenado, ou variável local de programa armazenado. (Dentro de uma instrução `SELECT ... INTO var_list` preparada, apenas variáveis definidas pelo usuário são permitidas; veja Seção 13.6.4.2, “Âmbito e Resolução de Variáveis Locais”.)

- Os valores selecionados são atribuídos às variáveis. O número de variáveis deve corresponder ao número de colunas. A consulta deve retornar uma única linha. Se a consulta não retornar nenhuma linha, um aviso com o código de erro 1329 ocorrerá (`Sem dados`) e os valores das variáveis permanecerão inalterados. Se a consulta retornar várias linhas, o erro 1172 ocorrerá (`Resultado consistiu em mais de uma linha`). Se for possível que a instrução possa recuperar várias linhas, você pode usar `LIMIT 1` para limitar o conjunto de resultados a uma única linha.

  ```sql
  SELECT id, data INTO @x, @y FROM test.t1 LIMIT 1;
  ```

Os nomes das variáveis do usuário não são sensíveis ao maiúsculas e minúsculas. Consulte Seção 9.4, “Variáveis Definidas pelo Usuário”.

O formulário `SELECT ... INTO OUTFILE 'nome_arquivo'` do comando `SELECT` escreve as linhas selecionadas em um arquivo. O arquivo é criado no host do servidor, portanto, você deve ter o privilégio `FILE` para usar essa sintaxe. *`nome_arquivo`* não pode ser um arquivo existente, o que, entre outras coisas, impede que arquivos como `/etc/passwd` e tabelas de banco de dados sejam modificados. A variável de sistema `character_set_filesystem` controla a interpretação do nome do arquivo.

A instrução `SELECT ... INTO OUTFILE` é destinada a permitir o descarte de uma tabela em um arquivo de texto no host do servidor. Para criar o arquivo resultante em outro host, `SELECT ... INTO OUTFILE` normalmente é inadequado porque não há como escrever um caminho para o arquivo em relação ao sistema de arquivos do host do servidor, a menos que a localização do arquivo no host remoto possa ser acessada usando um caminho mapeado pela rede no sistema de arquivos do host do servidor.

Alternativamente, se o software cliente MySQL estiver instalado no host remoto, você pode usar um comando do cliente, como `mysql -e "SELECT ..." > nome_do_arquivo`, para gerar o arquivo nesse host.

`SELECT ... INTO OUTFILE` é o complemento de `LOAD DATA`. Os valores das colunas são escritos convertidos para o conjunto de caracteres especificado na cláusula `CHARACTER SET`. Se tal cláusula não estiver presente, os valores são descarregados usando o conjunto de caracteres `binary`. Na prática, não há conversão de conjunto de caracteres. Se um conjunto de resultados contiver colunas em vários conjuntos de caracteres, o mesmo acontece com o arquivo de dados de saída e pode não ser possível recarregar o arquivo corretamente.

A sintaxe para a parte *`export_options`* da declaração consiste nas mesmas cláusulas `FIELDS` e `LINES` que são usadas com a declaração `LOAD DATA`. Para obter informações mais detalhadas sobre as cláusulas `FIELDS` e `LINES`, incluindo seus valores padrão e valores permitidos, consulte Seção 13.2.6, “Instrução LOAD DATA”.

`FIELDS ESCAPED BY` controla como os caracteres especiais são escritos. Se o caractere `FIELDS ESCAPED BY` não estiver vazio, ele é usado quando necessário para evitar ambiguidade como um prefixo que precede os caracteres seguintes na saída:

- O caractere `FIELDS ESCAPED BY`

- O caractere `FIELDS [OPÇÕES] ENCLOSED BY`

- O primeiro caractere dos valores `FIELDS TERMINATED BY` e `LINES TERMINATED BY`

- ASCII `NUL` (o byte de valor zero; o que é realmente escrito após o caractere de escape é ASCII `0`, não um byte de valor zero)

Os caracteres `FIELDS TERMINATED BY`, `ENCLOSED BY`, `ESCAPED BY` ou `LINES TERMINATED BY` *devem* ser escapados para que você possa ler o arquivo de volta de forma confiável. O `NUL` ASCII é escapado para facilitar a visualização com alguns pagers.

O arquivo resultante não precisa seguir a sintaxe do SQL, então nada mais precisa ser escamado.

Se o caractere `FIELDS ESCAPED BY` estiver vazio, nenhum caractere será escavado e `NULL` será exibido como `NULL`, não como `\N`. Provavelmente não é uma boa ideia especificar um caractere de escape vazio, especialmente se os valores dos campos em seus dados contiverem algum dos caracteres da lista que acabamos de fornecer.

Aqui está um exemplo que produz um arquivo no formato de valores separados por vírgula (CSV), usado por muitos programas:

```sql
SELECT a,b,a+b INTO OUTFILE '/tmp/result.txt'
  FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  FROM test_table;
```

Se você usar `INTO DUMPFILE` em vez de `INTO OUTFILE`, o MySQL escreve apenas uma linha no arquivo, sem nenhuma terminação de coluna ou linha e sem realizar nenhum processamento de escape. Isso é útil para selecionar um valor de `BLOB` e armazená-lo em um arquivo.

Nota

Qualquer arquivo criado por `INTO OUTFILE` ou `INTO DUMPFILE` é legível por todos os usuários no host do servidor. A razão para isso é que o servidor MySQL não pode criar um arquivo que seja de propriedade de qualquer usuário que não seja o usuário sob cuja conta ele está sendo executado. (Você *nunca* deve executar **mysqld** como `root` por essa e outras razões.) O arquivo, portanto, deve ser legível por todos para que você possa manipulá-lo.

Se a variável de sistema `secure_file_priv` estiver definida como um nome de diretório não vazio, o arquivo a ser escrito deve estar localizado nesse diretório.

No contexto das instruções `SELECT ... INTO` que ocorrem como parte de eventos executados pelo Agendamento de Eventos, mensagens de diagnóstico (não apenas erros, mas também avisos) são escritas no log de erro e, no Windows, no log de eventos do aplicativo. Para obter informações adicionais, consulte Seção 23.4.5, “Status do Agendamento de Eventos”.
